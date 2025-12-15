import React, { useState } from 'react';
import { CheckCircle2, FileText, Code, Copy, Check } from 'lucide-react';
import { AnalysisResult } from '../types';
import { Editor } from './Editor';

interface ResultsViewProps {
  result: AnalysisResult;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'report' | 'code'>('report');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.improvedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200 bg-slate-50 px-2 pt-2">
        <button
          onClick={() => setActiveTab('report')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'report'
              ? 'bg-white text-indigo-600 border-x border-t border-slate-200 -mb-px relative z-10'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Analysis Report
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === 'code'
              ? 'bg-white text-indigo-600 border-x border-t border-slate-200 -mb-px relative z-10'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Code className="w-4 h-4 mr-2" />
          Refactored Code
        </button>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-auto p-0 relative bg-white">
        
        {activeTab === 'report' && (
          <div className="p-6 space-y-6">
            {/* Summary */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-indigo-800 mb-2">Executive Summary</h3>
              <p className="text-indigo-900 leading-relaxed text-sm">
                {result.summary}
              </p>
            </div>

            {/* Suggestions */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-4">Improvement Checklist</h3>
              <div className="space-y-3">
                {result.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start p-3 bg-slate-50 rounded-lg border border-slate-100 transition-shadow hover:shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="ml-3 text-slate-700 text-sm leading-snug">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="flex flex-col h-full relative group">
             <div className="absolute top-3 right-4 z-10">
                <button 
                  onClick={handleCopy}
                  className="bg-white/90 backdrop-blur border border-slate-200 text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-md shadow-sm text-xs font-medium flex items-center transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
             </div>
            <Editor 
              value={result.improvedCode} 
              onChange={() => {}} 
              onClear={() => {}} 
              readOnly={true} 
              label="Modernized Output"
            />
          </div>
        )}
      </div>
    </div>
  );
};