import React from 'react';
import { Code2, X } from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  label?: string;
  readOnly?: boolean;
}

export const Editor: React.FC<EditorProps> = ({ 
  value, 
  onChange, 
  onClear,
  label = "Source Code",
  readOnly = false
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center space-x-2 text-slate-700 font-medium">
          <Code2 className="w-4 h-4 text-indigo-500" />
          <span>{label}</span>
        </div>
        {!readOnly && value && (
          <button 
            onClick={onClear}
            className="text-xs text-slate-500 hover:text-red-600 flex items-center transition-colors"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </button>
        )}
      </div>
      <div className="relative flex-grow">
        <textarea
          className="w-full h-full p-4 font-mono text-sm leading-relaxed bg-white text-slate-800 resize-none focus:outline-none focus:ring-inset focus:ring-2 focus:ring-indigo-500/50"
          placeholder={readOnly ? "Analysis results will appear here..." : "Paste your HTML/CSS code here..."}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
        />
      </div>
    </div>
  );
};