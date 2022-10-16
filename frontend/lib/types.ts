// User type for user store
export interface User {
  username: string;
  loginState: boolean;
}

export interface Message {
  senderName: string;
  senderId: string;
  content: string;
  sessionId: string;
  createdAt: Date;
  id: string;
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
