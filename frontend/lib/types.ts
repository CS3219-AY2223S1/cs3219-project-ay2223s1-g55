// User type for user store
export interface User {
  username: string;
  loginState: boolean;
}

// Question types
export type Difficulty = 'All' | 'Easy' | 'Medium' | 'Hard';
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
}
