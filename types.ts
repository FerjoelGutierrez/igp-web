export interface AnalysisResult {
  summary: string;
  suggestions: string[];
  improvedCode: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  originalCode: string;
  result: AnalysisResult;
}