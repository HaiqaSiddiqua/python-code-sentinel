
import React, { useState, useCallback } from 'react';
import { detectBugs, generateTests } from './services/geminiService';
import type { BugReportItem } from './types';
import { AppState, ViewType } from './types';
import { CodeEditor } from './components/CodeEditor';
import { BugReport } from './components/BugReport';
import { TestDisplay } from './components/TestDisplay';
import { Loader } from './components/Loader';
import { BugIcon } from './components/icons/BugIcon';
import { TestTubeIcon } from './components/icons/TestTubeIcon';
import { CodeIcon } from './components/icons/CodeIcon';

const App: React.FC = () => {
    const [pythonCode, setPythonCode] = useState<string>('');
    const [bugReport, setBugReport] = useState<BugReportItem[] | null>(null);
    const [generatedTests, setGeneratedTests] = useState<string | null>(null);
    const [appState, setAppState] = useState<AppState>(AppState.Idle);
    const [error, setError] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<ViewType>(ViewType.Bugs);

    const handleDetectBugs = useCallback(async () => {
        if (!pythonCode.trim()) {
            setError("Please enter some Python code to analyze.");
            return;
        }
        setAppState(AppState.DetectingBugs);
        setError(null);
        setBugReport(null);
        setActiveView(ViewType.Bugs);

        try {
            const report = await detectBugs(pythonCode);
            setBugReport(report);
            setAppState(AppState.Idle);
        } catch (err) {
            console.error(err);
            setError("Failed to detect bugs. Please check your API key and network connection.");
            setAppState(AppState.Error);
        }
    }, [pythonCode]);

    const handleGenerateTests = useCallback(async () => {
        if (!pythonCode.trim()) {
            setError("Please enter some Python code to generate tests for.");
            return;
        }
        setAppState(AppState.GeneratingTests);
        setError(null);
        setGeneratedTests(null);
        setActiveView(ViewType.Tests);

        try {
            const tests = await generateTests(pythonCode);
            setGeneratedTests(tests);
            setAppState(AppState.Idle);
        } catch (err) {
            console.error(err);
            setError("Failed to generate tests. Please check your API key and network connection.");
            setAppState(AppState.Error);
        }
    }, [pythonCode]);

    const isLoading = appState === AppState.DetectingBugs || appState === AppState.GeneratingTests;

    const renderResults = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-lg h-full">
                    <Loader />
                    <p className="mt-4 text-lg text-gray-300 animate-pulse">
                        {appState === AppState.DetectingBugs ? 'Analyzing code for bugs...' : 'Generating unit tests...'}
                    </p>
                </div>
            );
        }
        
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center p-8 bg-red-900/20 border border-red-500 rounded-lg h-full">
                    <p className="text-red-400">{error}</p>
                </div>
            );
        }

        if (!bugReport && !generatedTests) {
            return (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-lg h-full border-2 border-dashed border-gray-600">
                    <CodeIcon className="w-16 h-16 text-gray-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-300">Results will appear here</h3>
                    <p className="text-gray-400 mt-2">Run bug detection or test generation to see the output.</p>
                </div>
            );
        }

        return (
            <div className="bg-gray-800 rounded-lg overflow-hidden h-full flex flex-col">
                <div className="flex border-b border-gray-700">
                    <button
                        onClick={() => setActiveView(ViewType.Bugs)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${activeView === ViewType.Bugs ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                        disabled={!bugReport}
                    >
                        <BugIcon className="w-5 h-5" />
                        Bug Report
                    </button>
                    <button
                        onClick={() => setActiveView(ViewType.Tests)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${activeView === ViewType.Tests ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                        disabled={!generatedTests}
                    >
                        <TestTubeIcon className="w-5 h-5" />
                        Generated Tests
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {activeView === ViewType.Bugs && bugReport && <BugReport report={bugReport} />}
                    {activeView === ViewType.Tests && generatedTests && <TestDisplay tests={generatedTests} />}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col p-4 sm:p-6 lg:p-8">
            <header className="text-center mb-6">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                    Python Code <span className="text-indigo-400">Sentinel</span>
                </h1>
                <p className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">
                    Your AI-powered assistant for robust and reliable Python code.
                </p>
            </header>

            <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col bg-gray-800 rounded-lg p-4 shadow-lg">
                    <h2 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">Your Python Code</h2>
                    <div className="flex-grow">
                        <CodeEditor
                            value={pythonCode}
                            onChange={(e) => setPythonCode(e.target.value)}
                            placeholder="Paste your Python code here..."
                        />
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleDetectBugs}
                            disabled={isLoading}
                            className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-800 disabled:cursor-not-allowed transition-colors"
                        >
                            <BugIcon className="w-5 h-5 mr-2" />
                            Detect Bugs
                        </button>
                        <button
                            onClick={handleGenerateTests}
                            disabled={isLoading}
                            className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-800 disabled:cursor-not-allowed transition-colors"
                        >
                            <TestTubeIcon className="w-5 h-5 mr-2" />
                            Generate Tests
                        </button>
                    </div>
                </div>

                <div className="flex flex-col">
                    {renderResults()}
                </div>
            </main>
        </div>
    );
};

export default App;
