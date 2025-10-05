import React from 'react';

const MicrophoneIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6zM12 12.75a3 3 0 01-3-3v-1.5a3 3 0 016 0v1.5a3 3 0 01-3 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5v.75a7.5 7.5 0 01-7.5 7.5s-7.5 0-7.5-7.5V10.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75v2.25m0-11.25v-1.5" />
    </svg>
);

export default MicrophoneIcon;