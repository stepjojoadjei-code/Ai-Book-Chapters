import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import ApiKeyModal from '../components/ApiKeyModal';

interface ApiKeyContextType {
    apiKey: string | null;
    setApiKey: (key: string | null) => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [apiKey, setApiKey] = useLocalStorage<string | null>('gemini-api-key', null);

    return (
        <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
            {!apiKey ? <ApiKeyModal /> : children}
        </ApiKeyContext.Provider>
    );
};

export const useApiKey = (): ApiKeyContextType => {
    const context = useContext(ApiKeyContext);
    if (!context) {
        throw new Error('useApiKey must be used within an ApiKeyProvider');
    }
    return context;
};