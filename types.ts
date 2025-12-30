
export enum AppState {
  WELCOME = 'WELCOME',
  NAME_INPUT = 'NAME_INPUT',
  QUESTIONS = 'QUESTIONS',
  CONFIDENCE_CHECK = 'CONFIDENCE_CHECK',
  INTERPRETING = 'INTERPRETING',
  RESULT = 'RESULT'
}

export type BranchCode = 'CSE' | 'IT' | 'ECE' | 'ME' | 'CE' | 'EEE';

export interface UserResponses {
  name: string;
  [key: string]: string;
}

export interface BranchMatch {
  code: BranchCode;
  label: string;
  level: 'High' | 'Medium' | 'Low';
}

export interface BranchResult {
  suggestedBranch: string;
  secondaryBranches: string[];
  reasoning: string;
  reasoningBullets: string[];
  palmInsights: {
    headLine: string;
    lifeLine: string;
    palmShape: string;
  };
  date: string;
  colorTheme: string;
  userName: string;
  personalitySummary: string;
  comparisons: BranchMatch[];
  academicExplanation: string;
}

export interface QuestionOption {
  text: string;
  weights: Partial<Record<BranchCode, number>>;
}

export interface Question {
  id: string;
  text: string;
  phase: 'Cognitive Patterns' | 'Learning & Work' | 'Engineering Scenarios';
  options: QuestionOption[];
}
