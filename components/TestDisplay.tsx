
import React from 'react';
import { CodeEditor } from './CodeEditor';

interface TestDisplayProps {
    tests: string;
}

export const TestDisplay: React.FC<TestDisplayProps> = ({ tests }) => {
    return (
        <div className="p-4 h-full flex flex-col">
            <CodeEditor
                value={tests}
                readOnly
            />
        </div>
    );
};
