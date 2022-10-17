// User type for user store
export interface User {
  username: string;
  loginState: boolean;
  socketId: string;
}

// Question types
export const difficulties = ['All', 'Easy', 'Medium', 'Hard'] as const;
export type Difficulty = typeof difficulties[number];
export interface QuestionType {
  title: string;
  description: string;
  difficulty: Difficulty;
  examples: QuestionExampleType[];
  constraints: string[];
  comments: QuestionCommentType[];
}

export interface QuestionExampleType {
  input: string;
  output: string;
  explanation?: string;
}

export interface QuestionCommentType {
  user: string;
  comment: string;
  created_at?: string;
}

// History Service types
export interface IHistoryRecord {
  firstUsername: string;
  secondUsername: string;
  questionName: string;
  startedAt?: number;
  duration?: number;
}

export interface IExperience {
  experiencePoints: number;
  experienceLevel: string;
}

// API Function Types
export interface IUrlParams {
  [slug: string]: string | number;
}

export interface IQueryParams {
  [query: string]: string | number;
}

export interface IGetOptions {
  queryParams?: IQueryParams; // Query params eg: "?region=central"
  urlParams?: IUrlParams; // URL params, eg: "/api/:username"
}
