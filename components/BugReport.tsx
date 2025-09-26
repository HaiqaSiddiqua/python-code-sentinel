
import React from 'react';
import type { BugReportItem } from '../types';

interface BugReportProps {
    report: BugReportItem[];
}

const severityColors: { [key in BugReportItem['severity']]: string } = {
    'Critical': 'bg-red-600 border-red-500',
    'High': 'bg-orange-600 border-orange-500',
    'Medium': 'bg-yellow-600 border-yellow-500',
    'Low': 'bg-blue-600 border-blue-500',
    'Information': 'bg-gray-600 border-gray-500',
};

const SeverityBadge: React.FC<{ severity: BugReportItem['severity'] }> = ({ severity }) => {
    return (
        <span className={`px-2.5 py-1 text-xs font-semibold text-white rounded-full border ${severityColors[severity] || 'bg-gray-500'}`}>
            {severity}
        </span>
    );
};

export const BugReport: React.FC<BugReportProps> = ({ report }) => {
    if (report.length === 0) {
        return (
            <div className="p-8 text-center text-gray-400">
                <h3 className="text-xl font-semibold text-green-400">No bugs detected!</h3>
                <p>The code analysis completed without finding any critical issues.</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            {report.map((item, index) => (
                <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden shadow-md">
                    <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-700">
                        <h3 className="text-lg font-semibold text-indigo-300">
                            Line: <span className="font-mono bg-gray-700 px-2 py-1 rounded">{item.line_number}</span>
                        </h3>
                        <SeverityBadge severity={item.severity} />
                    </div>
                    <div className="p-4 space-y-3">
                        <div>
                            <h4 className="font-semibold text-gray-300">Description:</h4>
                            <p className="text-gray-400">{item.bug_description}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-300">Suggested Fix:</h4>
                            <p className="text-gray-400 whitespace-pre-wrap font-mono bg-gray-900 p-3 rounded-md border border-gray-600 text-sm">{item.suggested_fix}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
