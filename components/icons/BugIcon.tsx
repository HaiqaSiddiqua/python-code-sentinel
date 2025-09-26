
import React from 'react';

export const BugIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h-4a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12v4" />
        <path d="M18 18h-2a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2h2v12" />
        <path d="M8 9h4" />
        <path d="M8 12h4" />
        <path d="M8 15h4" />
    </svg>
);
