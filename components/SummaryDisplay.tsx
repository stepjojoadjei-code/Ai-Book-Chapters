import React, { useState } from 'react';
import type { ChapterSummary } from '../types';
import QuoteIcon from './icons/QuoteIcon';
import SparklesIcon from './icons/SparklesIcon';
import SpeakerIcon from './icons/SpeakerIcon';
import ClipboardIcon from './icons/ClipboardIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import CheckIcon from './icons/CheckIcon';
import XMarkIcon from './icons/XMarkIcon';

interface SummaryDisplayProps {
    summary: ChapterSummary;
    isSpeaking: boolean;
    onToggleSpeak: (summary: ChapterSummary) => void;
    voices: SpeechSynthesisVoice[];
    selectedVoice: SpeechSynthesisVoice | null;
    onVoiceChange: (voice: SpeechSynthesisVoice) => void;
    speechSupported: boolean;
    onUpdate: (summary: ChapterSummary) => void;
    onDelete: (id: string) => void;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary, isSpeaking, onToggleSpeak, voices, selectedVoice, onVoiceChange, speechSupported, onUpdate, onDelete }) => {
    const [copiedQuoteIndex, setCopiedQuoteIndex] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedSummary, setEditedSummary] = useState(summary);

    const handleCopyQuote = (quote: string, index: number) => {
        navigator.clipboard.writeText(quote)
            .then(() => {
                setCopiedQuoteIndex(index);
                setTimeout(() => setCopiedQuoteIndex(null), 2000);
            })
            .catch(err => console.error('Failed to copy text: ', err));
    };

    const handleCancelEdit = () => {
        setEditedSummary(summary);
        setIsEditing(false);
    };

    const handleSaveEdit = () => {
        onUpdate(editedSummary);
        setIsEditing(false);
    };
    
    const handleFieldChange = (field: keyof Omit<ChapterSummary, 'id' | 'takeaways' | 'quotes'>, value: string) => {
        setEditedSummary(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field: 'takeaways' | 'quotes', value: string) => {
        setEditedSummary(prev => ({ ...prev, [field]: value.split('\n') }));
    };
    
    if (isEditing) {
        return (
             <article className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 md:p-8 border border-cyan-500/50 dark:border-cyan-500">
                <div className="mb-6">
                    <label htmlFor="chapterTitle" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Chapter Title</label>
                    <input
                        type="text"
                        id="chapterTitle"
                        value={editedSummary.chapterTitle}
                        onChange={(e) => handleFieldChange('chapterTitle', e.target.value)}
                        className="w-full p-2 bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="takeaways" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Key Takeaways (one per line)</label>
                    <textarea
                        id="takeaways"
                        value={editedSummary.takeaways.join('\n')}
                        onChange={(e) => handleArrayChange('takeaways', e.target.value)}
                        className="w-full h-32 p-2 bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-y"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="quotes" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Memorable Quotes (one per line)</label>
                     <textarea
                        id="quotes"
                        value={editedSummary.quotes.join('\n')}
                        onChange={(e) => handleArrayChange('quotes', e.target.value)}
                        className="w-full h-32 p-2 bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-y"
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <button onClick={handleCancelEdit} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-md transition-colors">
                        <XMarkIcon className="w-5 h-5"/> Cancel
                    </button>
                    <button onClick={handleSaveEdit} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors">
                        <CheckIcon className="w-5 h-5" /> Save Changes
                    </button>
                </div>
            </article>
        );
    }

    return (
        <article className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/80 dark:to-slate-900/70 rounded-xl shadow-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 backdrop-blur-sm animate-fade-in-scale">
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                 <h2 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 tracking-wide">{summary.chapterTitle}</h2>
                 <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setIsEditing(true)} aria-label="Edit summary" className="p-2 rounded-full transition-colors duration-200 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600/80 text-slate-500 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300"><PencilIcon className="w-5 h-5" /></button>
                    <button onClick={() => onDelete(summary.id)} aria-label="Delete summary" className="p-2 rounded-full transition-colors duration-200 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600/80 text-slate-500 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400"><TrashIcon className="w-5 h-5" /></button>
                 </div>
            </header>
            
             {speechSupported && voices.length > 0 && (
                 <div className="flex items-center gap-2 mb-6 p-3 bg-slate-100/80 dark:bg-slate-900/30 rounded-lg">
                     <button 
                        onClick={() => onToggleSpeak(summary)}
                        className={`p-2 rounded-full transition-colors duration-200 ${isSpeaking ? 'bg-red-500/80 hover:bg-red-600/80 text-white' : 'bg-cyan-500/80 hover:bg-cyan-600/80 text-white'}`}
                        aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
                     >
                        <SpeakerIcon className="w-5 h-5" isSpeaking={isSpeaking} />
                     </button>
                     <select
                        value={selectedVoice?.name || ''}
                        onChange={(e) => {
                            const voice = voices.find(v => v.name === e.target.value);
                            if(voice) onVoiceChange(voice);
                        }}
                        className="bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2"
                        aria-label="Select a voice"
                     >
                        {voices.map(voice => (
                            <option key={voice.name} value={voice.name}>
                                {voice.name} ({voice.lang})
                            </option>
                        ))}
                     </select>
                 </div>
             )}
            
            <div className="mb-8">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                    <SparklesIcon className="w-5 h-5 text-cyan-500" />
                    Key Takeaways
                </h3>
                <ul className="space-y-1 list-inside text-slate-600 dark:text-slate-300">
                    {summary.takeaways.map((takeaway, index) => (
                        <li key={index} className="p-2 rounded-lg transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-default flex items-start">
                           <span className="text-cyan-500 dark:text-cyan-400 mr-3 mt-1 flex-shrink-0">&#8226;</span>
                           <span>{takeaway}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {summary.quotes && summary.quotes.length > 0 && (
                 <div>
                    <h3 className="flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                        <QuoteIcon className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                        Memorable Quotes
                    </h3>
                    <div className="space-y-4">
                        {summary.quotes.map((quote, index) => (
                            <blockquote key={index} className="relative group p-4 pl-12 border-l-4 border-cyan-500 dark:border-cyan-600 bg-slate-100/50 dark:bg-slate-900/50 rounded-r-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-cyan-400">
                                <QuoteIcon className="absolute top-4 left-3 w-6 h-6 text-slate-300 dark:text-slate-700 transition-colors duration-300 group-hover:text-cyan-500 dark:group-hover:text-cyan-600" />
                                <p className="italic text-slate-700 dark:text-slate-300 transition-colors duration-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">"{quote}"</p>
                                <button
                                    onClick={() => handleCopyQuote(quote, index)}
                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-cyan-300 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    aria-label="Copy quote to clipboard"
                                >
                                    {copiedQuoteIndex === index ? (
                                        <span className="text-xs px-1 text-cyan-500 dark:text-cyan-400">Copied!</span>
                                    ) : (
                                        <ClipboardIcon className="w-4 h-4" />
                                    )}
                                </button>
                            </blockquote>
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
};

export default SummaryDisplay;