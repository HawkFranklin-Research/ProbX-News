export enum InputType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE'
}

export enum Verdict {
  REAL = 'REAL',
  FAKE = 'FAKE',
  INCONCLUSIVE = 'INCONCLUSIVE',
  SATIRE = 'SATIRE'
}

export interface Source {
  title: string;
  uri: string;
  snippet?: string;
}

export interface AgentLogEntry {
  action: string;
  findings: string;
  source?: string;
}

export interface AnalysisResult {
  verdict: Verdict;
  confidenceScore: number; // 0 to 100
  summary: string;
  detailedMarkdown: string;
  sources: Source[];
  agentLogs: AgentLogEntry[];
}