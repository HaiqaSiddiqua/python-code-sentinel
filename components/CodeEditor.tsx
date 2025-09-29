
import React from 'react';

interface CodeEditorProps {
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, placeholder, readOnly = false }) => {
    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            className="w-full h-full p-3 font-mono text-sm bg-gray-900 text-gray-200 border border-gray-700 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow duration-200"
            spellCheck="false"
            aria-label="Python code editor"
        />
    );
};
