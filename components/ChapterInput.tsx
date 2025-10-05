import React, { useState, useCallback } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import MicrophoneIcon from './icons/MicrophoneIcon';

interface ChapterInputProps {
    onSubmit: (text: string) => void;
    isLoading: boolean;
}

const MAX_CHARS = 15000;

const ChapterInput: React.FC<ChapterInputProps> = ({ onSubmit, isLoading }) => {
    const [text, setText] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleRecognitionResult = useCallback((transcript: string) => {
        if (validationError) setValidationError(null);
        setText(prev => {
            const newText = (prev.trim() ? prev + ' ' : '') + transcript;
            return newText.slice(0, MAX_CHARS);
        });
    }, [validationError]);
    
    const { isListening, supported: recognitionSupported, toggleListening } = useSpeechRecognition({
        onResult: handleRecognitionResult,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedText = text.trim();

        if (!trimmedText) {
            setValidationError("Chapter text cannot be empty. Please paste or dictate some content before summarizing.");
            return;
        }

        if (isLoading) return;

        setValidationError(null);
        onSubmit(trimmedText);
        setText('');
    };
    
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (validationError) {
            setValidationError(null);
        }
        setText(e.target.value.slice(0, MAX_CHARS));
    };

    const textareaBorderClass = validationError
        ? 'ring-2 ring-red-500/80 dark:ring-red-500/70'
        : 'focus:ring-2 focus:ring-cyan-500';

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className={`bg-white dark:bg-slate-800/50 rounded-lg shadow-lg p-1 border border-slate-200 dark:border-slate-700/50 relative transition-all duration-300 ${validationError ? 'border-red-500/50 dark:border-red-500/50' : ''}`}>
                <textarea
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Paste a chapter from your book here, or use the microphone to dictate..."
                    className={`w-full h-48 p-4 bg-transparent text-slate-800 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 rounded-md focus:outline-none resize-y transition-shadow ${textareaBorderClass}`}
                    disabled={isLoading}
                    maxLength={MAX_CHARS}
                    aria-invalid={!!validationError}
                    aria-describedby={validationError ? "chapter-input-error" : undefined}
                />
                <div className="absolute bottom-14 right-4 text-xs text-slate-400 dark:text-slate-500">
                    {text.length} / {MAX_CHARS}
                </div>
                {validationError && (
                    <p id="chapter-input-error" className="px-4 pb-2 text-sm text-red-600 dark:text-red-400" role="alert">
                        {validationError}
                    </p>
                )}
                <div className="flex justify-between items-center p-2">
                    <button
                        type="button"
                        onClick={toggleListening}
                        disabled={isLoading || !recognitionSupported}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300 relative ${isListening ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'} disabled:bg-slate-100/50 dark:disabled:bg-slate-600/50 disabled:cursor-not-allowed disabled:text-slate-400 dark:disabled:text-slate-500`}
                        aria-label={isListening ? "Stop dictation" : "Start dictation"}
                    >
                       {isListening && <div className="absolute inset-0 rounded-md pulse-ring-animation"></div>}
                       <MicrophoneIcon className="w-5 h-5" />
                       {isListening ? 'Listening...' : 'Dictate'}
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || !text.trim()}
                        className="flex items-center justify-center px-6 py-2.5 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 shadow-md disabled:shadow-none"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Summarizing...
                            </>
                        ) : 'Summarize Chapter'}
                    </button>
                </div>
            </div>
             {!recognitionSupported && <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-2">Voice dictation is not supported by your browser.</p>}
        </form>
    );
};

export default ChapterInput;