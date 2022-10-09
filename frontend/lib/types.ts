// User type for user store
export interface User {
  username: string;
  loginState: boolean;
}

// Question types
type Difficulty = 'Easy' | 'Medium' | 'Hard';
export interface Question {
  title: string;
  description: string;
  difficulty: Difficulty;
  examples: string[];
  constraints: string[];
}
