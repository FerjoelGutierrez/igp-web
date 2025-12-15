import React, { useState } from 'react';
import { Sparkles, Layout, AlertCircle, Play } from 'lucide-react';
import { Editor } from './components/Editor';
import { Button } from './components/Button';
import { ResultsView } from './components/ResultsView';
import { analyzeHtmlCode } from './services/gemini';
import { AnalysisResult, AnalysisStatus } from './types';

const INITIAL_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sample Page</title>
    <style>
        .box { width: 100%; padding: 20px; background: #eee; }
        .red { color: red; }
    </style>
</head>
<body>
    <div class="box">
        <h1 class="red">Hello World</h1>
        <p>This is a sample paragraph.</p>
        <button onclick="alert('clicked')">Click Me</button>
    </div>
</body>
</html>`;

export default function App() {
  const [code, setCode] = useState<string>(INITIAL_CODE);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    
    setStatus(AnalysisStatus.ANALYZING);
    setError(null);
    
    try {
      const analysisData = await analyzeHtmlCode(code);
      setResult(analysisData);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              CodeRefine AI
            </h1>
          </div>
          <div className="flex items-center space-x-4">
             <span className="text-sm text-slate-500 hidden sm:inline-block">Powered by Gemini 2.5</span>
             <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
               API Documentation
             </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
          
          {/* Left Column: Input */}
          <div className="flex flex-col space-y-4 h-full">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <Layout className="w-4 h-4 mr-2 text-slate-500" />
                Input Code
              </h2>
              <Button 
                onClick={handleAnalyze} 
                isLoading={status === AnalysisStatus.ANALYZING}
                disabled={!code.trim()}
                icon={<Play className="w-4 h-4 fill-current" />}
              >
                Analyze & Refactor
              </Button>
            </div>
            
            <div className="flex-grow overflow-hidden">
              <Editor 
                value={code} 
                onChange={setCode} 
                onClear={() => setCode('')}
                label="Legacy HTML/CSS"
              />
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="flex flex-col space-y-4 h-full">
             <div className="flex items-center justify-between h-8">
              <h2 className="text-lg font-semibold text-slate-800">Analysis Results</h2>
              {status === AnalysisStatus.SUCCESS && (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                  Analysis Complete
                </span>
              )}
            </div>

            <div className="flex-grow overflow-hidden bg-white rounded-xl shadow-sm border border-slate-200 relative">
              {status === AnalysisStatus.IDLE && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-600 mb-2">Ready to Optimize</h3>
                  <p className="max-w-md text-sm">Paste your HTML code on the left and click "Analyze" to get AI-powered suggestions and modern refactoring.</p>
                </div>
              )}

              {status === AnalysisStatus.ERROR && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 p-8">
                  <AlertCircle className="w-12 h-12 mb-4" />
                  <h3 className="text-lg font-medium">Analysis Failed</h3>
                  <p className="text-center mt-2 max-w-md text-slate-600">{error}</p>
                </div>
              )}

              {status === AnalysisStatus.SUCCESS && result && (
                <ResultsView result={result} />
              )}
              
              {status === AnalysisStatus.ANALYZING && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 z-20">
                    <div className="flex flex-col items-center space-y-4 animate-pulse">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <p className="mt-4 text-sm font-medium text-indigo-600">Analyzing code structure...</p>
                 </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}