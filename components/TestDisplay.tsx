
import React from 'react';
import { CodeEditor } from './CodeEditor';

interface TestDisplayProps {
    tests: string;
}

export const TestDisplay: React.FC<TestDisplayProps> = ({ tests }) => {
    return (
        <div className="h-full flex flex-col p-4">
            <CodeEditor
                value={tests}
                readOnly
            />
        </div>
    );
};
