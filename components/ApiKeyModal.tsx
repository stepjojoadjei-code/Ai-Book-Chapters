import React, { useState } from 'react';
import { useApiKey } from '../contexts/ApiKeyContext';
import SparklesIcon from './icons/SparklesIcon';

const ApiKeyModal: React.FC = () => {
    const [inputKey, setInputKey] = useState('');
    const { setApiKey } = useApiKey();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputKey.trim()) {
            setApiKey(inputKey.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-50 dark:bg-slate-800 rounded-lg shadow-2xl p-6 text-center animate-fade-in-scale">
                <SparklesIcon className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                    Enter Your Gemini API Key
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                    To use the summarizer, please provide your Google AI Gemini API key. Your key will be saved securely in your browser's local storage.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="password"
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        placeholder="Enter your API key here..."
                        className="w-full p-3 bg-white dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-center"
                        aria-label="Gemini API Key"
                    />
                    <button
                        type="submit"
                        disabled={!inputKey.trim()}
                        className="w-full px-6 py-3 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                    >
                        Save and Continue
                    </button>
                </form>
                 <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
                    You can get your API key from{' '}
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">
                        Google AI Studio
                    </a>.
                </p>
            </div>
             <style>{`
                @keyframes fade-in-scale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-scale { animation: fade-in-scale 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default ApiKeyModal;