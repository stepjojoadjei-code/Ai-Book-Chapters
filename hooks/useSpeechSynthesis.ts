import { useState, useEffect, useCallback } from 'react';

interface UseSpeechSynthesisArgs {
    onEnd: () => void;
}

export const useSpeechSynthesis = ({ onEnd }: UseSpeechSynthesisArgs) => {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);
    
    const populateVoiceList = useCallback(() => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length === 0) return;

        setVoices(availableVoices);

        if (!selectedVoice) {
            const enUSVoice = availableVoices.find(voice => voice.lang === 'en-US');
            setSelectedVoice(enUSVoice || availableVoices[0]);
        }
    }, [selectedVoice]);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setSupported(true);
            populateVoiceList();
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = populateVoiceList;
            }
        }
    }, [populateVoiceList]);

    const speak = useCallback((text: string) => {
        if (!supported || isSpeaking) return;
        
        // Cancel any previous speech to prevent overlap
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            onEnd();
        };
        utterance.onerror = (e) => {
            console.error("Speech synthesis error", e);
            setIsSpeaking(false);
            onEnd();
        };
        window.speechSynthesis.speak(utterance);
    }, [supported, isSpeaking, selectedVoice, onEnd]);

    const cancel = useCallback(() => {
        if (!supported) return;
        setIsSpeaking(false);
        window.speechSynthesis.cancel();
    }, [supported]);

    return { speak, cancel, isSpeaking, supported, voices, selectedVoice, setSelectedVoice };
};