// User type for user store
export interface User {
  username: string;
  loginState: boolean;
}

// Message type
export interface Message {
  senderName: string;
  senderId: string;
  content: string;
  sessionId: string;
  createdAt: Date;
  id: string;

  // Types from backend
  _id?: string;
  message?: string;
}

// Interface for socket typescript
export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  connect: () => void;
  roomMessage: (
    content: string,
    senderId: string,
    senderName: string,
    sessionId: string,
    createdAt: Date,
    id: string
  ) => void;
  receiveMessage: (
    content: string,
    senderId: string,
    senderName: string,
    sessionId: string,
    createdAt: Date,
    id: string
  ) => void;
  joinRoomSuccess: (sessionId: string, username: string, userId: string) => void;
  leaveRoom: (room: string, socketId: string) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  roomMessage: (
    content: string,
    sender: string,
    senderName: string,
    sessionId: string,
    createdAt: Date,
    id: string
  ) => void;
  joinRoom: (sessionId: string, username: string, userId: string) => void;
  leaveRoom: (sessionId: string, username: string, userId: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

export type MessageData = {
  content: string;
  senderName: string;
  senderId: string;
  sessionId: string;
};

// Question types
export const difficulties = ['All', 'Easy', 'Medium', 'Hard'] as const;
export type Difficulty = typeof difficulties[number];
export interface QuestionType {
  title: string;
  description: string;
  difficulty: Difficulty;
  comments?: QuestionCommentType[];
}
export interface QuestionCommentType {
  user: string;
  comment: string;
  created_at?: string;
}
export const QuestionDifficultyToColorMap = {
  Easy: 'green',
  Medium: 'orange',
  Hard: 'red',
};

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
