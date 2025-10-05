import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { summarizeChapter } from './services/geminiService';
import type { ChapterSummary } from './types';
import ChapterInput from './components/ChapterInput';
import SummaryDisplay from './components/SummaryDisplay';
import SparklesIcon from './components/icons/SparklesIcon';
import TrashIcon from './components/icons/TrashIcon';
import BookOpenIcon from './components/icons/BookOpenIcon';
import SearchIcon from './components/icons/SearchIcon';
import ThemeToggleButton from './components/ThemeToggleButton';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import useLocalStorage from './hooks/useLocalStorage';
import { useApiKey } from './contexts/ApiKeyContext';

const MAX_SUMMARIES = 5;

const App: React.FC = () => {
    const [summaries, setSummaries] = useLocalStorage<ChapterSummary[]>('chapter-summaries', []);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { apiKey } = useApiKey();

    const { 
        speak, 
        cancel, 
        isSpeaking,
        voices, 
        selectedVoice, 
        setSelectedVoice, 
        supported: speechSupported 
    } = useSpeechSynthesis({
        onEnd: () => setCurrentlySpeakingId(null),
    });

    // Effect to trim summaries from localStorage on initial load
    useEffect(() => {
        if (summaries.length > MAX_SUMMARIES) {
            setSummaries(s => s.slice(0, MAX_SUMMARIES));
        }
    // We only want this to run once on mount to clean up old state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleSummarize = useCallback(async (text: string) => {
        if (!apiKey) {
            setError("API Key is not configured. Please refresh and enter your key.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const summaryData = await summarizeChapter(text, apiKey);
            const newSummary: ChapterSummary = { ...summaryData, id: crypto.randomUUID() };
            setSummaries(prev => [newSummary, ...prev].slice(0, MAX_SUMMARIES));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [setSummaries, apiKey]);

    const handleToggleSpeak = useCallback((summary: ChapterSummary) => {
        if (currentlySpeakingId === summary.id) {
            if (window.confirm("Are you sure you want to stop reading aloud?")) {
                cancel();
            }
        } else {
            cancel();
            setCurrentlySpeakingId(summary.id);
            const textToSpeak = [
                `Chapter: ${summary.chapterTitle}.`,
                "Key Takeaways.",
                ...summary.takeaways,
                "Memorable Quotes.",
                ...summary.quotes,
            ].join("\n");
            speak(textToSpeak);
        }
    }, [cancel, currentlySpeakingId, speak]);
    
    const handleVoiceChange = useCallback((voice: SpeechSynthesisVoice) => {
        if (isSpeaking) {
            if (window.confirm("Changing the voice will stop the current speech. Continue?")) {
                cancel();
                setSelectedVoice(voice);
            }
        } else {
            setSelectedVoice(voice);
        }
    }, [isSpeaking, cancel, setSelectedVoice]);

    const handleUpdateSummary = (updatedSummary: ChapterSummary) => {
        setSummaries(prev => prev.map(s => s.id === updatedSummary.id ? updatedSummary : s));
    };

    const handleDeleteSummary = (id: string) => {
        if (window.confirm("Are you sure you want to delete this summary? This action cannot be undone.")) {
            setSummaries(prev => prev.filter(s => s.id !== id));
        }
    };
    
    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to clear all summaries? This action cannot be undone.")) {
            setSummaries([]);
        }
    };

    const filteredSummaries = useMemo(() => {
        return summaries.filter(summary => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            const titleMatch = summary.chapterTitle.toLowerCase().includes(query);
            const takeawaysMatch = summary.takeaways.some(t => t.toLowerCase().includes(query));
            const quotesMatch = summary.quotes.some(q => q.toLowerCase().includes(query));
            return titleMatch || takeawaysMatch || quotesMatch;
        });
    }, [summaries, searchQuery]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            {(isLoading || isSpeaking) && (
                <div className="fixed top-0 left-0 right-0 h-1 w-full bg-cyan-500/20 overflow-hidden z-50">
                    <div className="h-full bg-cyan-500 w-full animate-indeterminate-progress"></div>
                </div>
            )}
            <style>{`
                @keyframes fade-in-scale {
                    from { opacity: 0; transform: translateY(-15px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in-scale { animation: fade-in-scale 0.5s ease-out forwards; }

                @keyframes pulse-ring {
                    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); } /* red-500 */
                    70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
                .pulse-ring-animation { animation: pulse-ring 2s infinite cubic-bezier(0.215, 0.61, 0.355, 1); }

                @keyframes indeterminate-progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-indeterminate-progress {
                    animation: indeterminate-progress 1.5s infinite ease-in-out;
                }
            `}</style>
            <main className="container mx-auto">
                <header className="text-center my-8 relative">
                    <div className="absolute top-0 right-0">
                        <ThemeToggleButton />
                    </div>
                    <div className="inline-flex items-center gap-3">
                        <SparklesIcon className="w-10 h-10 text-cyan-500" />
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-teal-400">
                            Book Summarizer AI
                        </h1>
                    </div>
                    <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Power your reading with AI. Paste a chapter to get instant insights, key takeaways, and memorable quotes.
                    </p>
                </header>

                <div className="my-10">
                    <ChapterInput onSubmit={handleSummarize} isLoading={isLoading} />
                </div>
                
                {error && (
                    <div className="w-full max-w-2xl mx-auto my-4 p-4 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 rounded-lg text-center">
                        <p><strong>Error:</strong> {error}</p>
                    </div>
                )}

                <div className="mt-12">
                     {summaries.length > 0 && (
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center max-w-2xl mx-auto mb-6">
                            <div className="relative w-full sm:w-auto">
                                <SearchIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="search"
                                    placeholder="Search summaries..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-64 bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                            <button
                                onClick={handleClearAll}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-700/50 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-md transition-colors flex-shrink-0"
                                aria-label="Clear all summaries"
                            >
                                <TrashIcon className="w-4 h-4" />
                                Clear All
                            </button>
                        </div>
                    )}
                    <div className="space-y-8">
                        {filteredSummaries.length > 0 ? (
                            filteredSummaries.map((summary) => (
                                <SummaryDisplay 
                                    key={summary.id} 
                                    summary={summary}
                                    isSpeaking={currentlySpeakingId === summary.id}
                                    onToggleSpeak={handleToggleSpeak}
                                    voices={voices}
                                    selectedVoice={selectedVoice}
                                    onVoiceChange={handleVoiceChange}
                                    speechSupported={speechSupported}
                                    onUpdate={handleUpdateSummary}
                                    onDelete={handleDeleteSummary}
                                />
                            ))
                        ) : (
                            !isLoading && (
                                <div className="text-center text-slate-500 dark:text-slate-500 py-10 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl max-w-2xl mx-auto">
                                    <BookOpenIcon className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-600 mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400">{searchQuery ? 'No summaries found' : 'Your summaries will appear here'}</h3>
                                    <p className="mt-1">{searchQuery ? `Your search for "${searchQuery}" did not match any summaries.` : 'Get started by pasting or dictating a chapter above.'}</p>

                                </div>
                            )
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;