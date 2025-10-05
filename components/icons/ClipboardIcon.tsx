import React from 'react';

const ClipboardIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v3.042m-7.332 0c-.055.194-.084.4-.084.612v3.042m0 0a2.25 2.25 0 002.25 2.25h3a2.25 2.25 0 002.25-2.25V6.75m-7.332 0h7.332" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5v-1.5a3.375 3.375 0 00-3.375-3.375h-9A3.375 3.375 0 003.375 12v1.5m16.125 0a2.25 2.25 0 01-2.25 2.25h-11.25a2.25 2.25 0 01-2.25-2.25v-1.5m15.375 0c.325.044.65.08.975.112a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25v-1.5a2.25 2.25 0 011.275-2.062" />
    </svg>
);

export default ClipboardIcon;
