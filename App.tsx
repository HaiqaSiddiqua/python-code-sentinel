
import React, { useState, useCallback, useRef } from 'react';
import { detectBugs, generateTests } from './services/geminiService';
import type { BugReportItem } from './types';
import { AppState, ViewType, Language } from './types';
import { CodeEditor } from './components/CodeEditor';
import { BugReport } from './components/BugReport';
import { TestDisplay } from './components/TestDisplay';
import { Loader } from './components/Loader';
import { BugIcon } from './components/icons/BugIcon';
import { TestTubeIcon } from './components/icons/TestTubeIcon';
import { CodeIcon } from './components/icons/CodeIcon';
import { UploadIcon } from './components/icons/UploadIcon';
import { CopyIcon } from './components/icons/CopyIcon';
import { DownloadIcon } from './components/icons/DownloadIcon';

const App: React.FC = () => {
    const [code, setCode] = useState<string>('');
    const [bugReport, setBugReport] = useState<BugReportItem[] | null>(null);
    const [generatedTests, setGeneratedTests] = useState<string | null>(null);
    const [appState, setAppState] = useState<AppState>(AppState.Idle);
    const [error, setError] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<ViewType>(ViewType.Bugs);
    const [language, setLanguage] = useState<Language>('python');
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDetectBugs = useCallback(async () => {
        if (!code.trim()) {
            setError(`Please enter some ${language === 'python' ? 'Python' : 'Java'} code to analyze.`);
            return;
        }
        setAppState(AppState.DetectingBugs);
        setError(null);
        setBugReport(null);
        setGeneratedTests(null);
        setActiveView(ViewType.Bugs);

        try {
            const report = await detectBugs(code, language);
            setBugReport(report);
            setAppState(AppState.Idle);
        } catch (err) {
            console.error(err);
            setError("Failed to detect bugs. Please check your API key and network connection.");
            setAppState(AppState.Error);
        }
    }, [code, language]);

    const handleGenerateTests = useCallback(async () => {
        if (!code.trim()) {
            setError(`Please enter some ${language === 'python' ? 'Python' : 'Java'} code to generate tests for.`);
            return;
        }
        setAppState(AppState.GeneratingTests);
        setError(null);
        setGeneratedTests(null);
        setBugReport(null);
        setActiveView(ViewType.Tests);

        try {
            const tests = await generateTests(code, language);
            setGeneratedTests(tests);
            setAppState(AppState.Idle);
        } catch (err) {
            console.error(err);
            setError("Failed to generate tests. Please check your API key and network connection.");
            setAppState(AppState.Error);
        }
    }, [code, language]);
    
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const isPython = file.name.endsWith('.py');
            const isJava = file.name.endsWith('.java');

            if (isPython || isJava) {
                const newLang = isPython ? 'python' : 'java';
                setLanguage(newLang);
                const reader = new FileReader();
                reader.onload = (e) => {
                    const text = e.target?.result as string;
                    setCode(text);
                    setError(null);
                };
                reader.onerror = () => setError('Failed to read the file.');
                reader.readAsText(file);
            } else {
                setError('Please upload a valid Python (.py) or Java (.java) file.');
            }
        }
        if(event.target) event.target.value = '';
    };

    const handleCopy = () => {
        let contentToCopy = '';
        if (activeView === ViewType.Bugs && bugReport) {
            contentToCopy = bugReport.map(item => 
                `Line: ${item.line_number}\nSeverity: ${item.severity}\nDescription: ${item.bug_description}\nSuggested Fix:\n${item.suggested_fix}`
            ).join('\n\n---\n\n');
        } else if (activeView === ViewType.Tests && generatedTests) {
            contentToCopy = generatedTests;
        }

        if (contentToCopy) {
            navigator.clipboard.writeText(contentToCopy).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    const handleDownload = () => {
        let blob: Blob;
        let filename: string;

        if (activeView === ViewType.Bugs && bugReport) {
            blob = new Blob([JSON.stringify(bugReport, null, 2)], { type: 'application/json' });
            filename = 'bug_report.json';
        } else if (activeView === ViewType.Tests && generatedTests) {
            const extension = language === 'python' ? 'py' : 'java';
            const defaultFilename = language === 'python' ? 'test_generated' : 'GeneratedTest';
            blob = new Blob([generatedTests], { type: 'text/plain' });
            filename = `${defaultFilename}.${extension}`;
        } else {
            return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const isLoading = appState === AppState.DetectingBugs || appState === AppState.GeneratingTests;
    const languageName = language === 'python' ? 'Python' : 'Java';

    const renderResults = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-lg h-full">
                    <Loader />
                    <p className="mt-4 text-lg text-gray-300 animate-pulse">
                        {appState === AppState.DetectingBugs ? `Analyzing ${languageName} code for bugs...` : `Generating ${languageName} unit tests...`}
                    </p>
                </div>
            );
        }
        
        if (error) {
            return <div className="flex flex-col items-center justify-center p-8 bg-red-900/20 border border-red-500 rounded-lg h-full"><p className="text-red-400">{error}</p></div>;
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

        const canCopyOrDownload = (activeView === ViewType.Bugs && bugReport) || (activeView === ViewType.Tests && generatedTests);

        return (
            <div className="bg-gray-800 rounded-lg overflow-hidden h-full flex flex-col">
                <div className="flex justify-between items-center border-b border-gray-700 pr-2">
                    <div className="flex">
                        <button onClick={() => setActiveView(ViewType.Bugs)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${activeView === ViewType.Bugs ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'} disabled:text-gray-500 disabled:hover:bg-transparent`} disabled={!bugReport}><BugIcon className="w-5 h-5" />Bug Report</button>
                        <button onClick={() => setActiveView(ViewType.Tests)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${activeView === ViewType.Tests ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'} disabled:text-gray-500 disabled:hover:bg-transparent`} disabled={!generatedTests}><TestTubeIcon className="w-5 h-5" />Generated Tests</button>
                    </div>
                    {canCopyOrDownload && (
                        <div className="flex items-center gap-2">
                             <button onClick={handleCopy} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors" aria-label="Copy results">
                                {copied ? <span className="text-sm text-green-400">Copied!</span> : <CopyIcon className="w-5 h-5" />}
                            </button>
                            <button onClick={handleDownload} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors" aria-label="Download results"><DownloadIcon className="w-5 h-5" /></button>
                        </div>
                    )}
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
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={language === 'python' ? '.py' : '.java'} style={{ display: 'none' }} aria-hidden="true" />
            <header className="text-center mb-6">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                    Code <span className="text-indigo-400">Sentinel</span>
                </h1>
                <p className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">
                    Your AI-powered assistant for robust and reliable Python and Java code.
                </p>
            </header>

            <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col bg-gray-800 rounded-lg p-4 shadow-lg">
                    <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
                        <h2 className="text-xl font-semibold">Your {languageName} Code</h2>
                        <button onClick={handleUploadClick} className="inline-flex items-center justify-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors" aria-label={`Upload ${languageName} file`}><UploadIcon className="w-4 h-4 mr-2" />Upload File</button>
                    </div>

                    <div className="flex bg-gray-900 rounded-lg p-1 mb-3">
                        <button onClick={() => setLanguage('python')} className={`flex-1 text-sm font-semibold py-2 rounded-md transition-colors duration-200 ${language === 'python' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Python</button>
                        <button onClick={() => setLanguage('java')} className={`flex-1 text-sm font-semibold py-2 rounded-md transition-colors duration-200 ${language === 'java' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Java</button>
                    </div>

                    <div className="flex-grow">
                        <CodeEditor value={code} onChange={(e) => setCode(e.target.value)} placeholder={`Paste your ${languageName} code here or upload a file...`} />
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row gap-4">
                        <button onClick={handleDetectBugs} disabled={isLoading} className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-800 disabled:cursor-not-allowed transition-colors"><BugIcon className="w-5 h-5 mr-2" />Detect Bugs</button>
                        <button onClick={handleGenerateTests} disabled={isLoading} className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-800 disabled:cursor-not-allowed transition-colors"><TestTubeIcon className="w-5 h-5 mr-2" />Generate Tests</button>
                    </div>
                </div>

                <div className="flex flex-col">{renderResults()}</div>
            </main>
        </div>
    );
};

export default App;
