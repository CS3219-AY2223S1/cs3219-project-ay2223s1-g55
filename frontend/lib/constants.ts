// Socket Events
export const EMIT_EVENT = {
  // TODO: Split to categories
  MESSAGE: 'message',
  SEND_MESSAGE: 'send-message',
  RECEIVE_MESSAGE: 'receive-message',
  JOIN_ROOM: 'join-room',
  JOIN_ROOM_SUCCESS: 'join-room-success',
  LEAVE_ROOM: 'leave-room',
  MATCH_FOUND: 'match-found',
};

// Listener
export const ON_EVENT = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  SEND_MESSAGE: 'send-message',
  RECEIVE_MESSAGE: 'receive-message',
  JOIN_ROOM: 'join-room',
  JOIN_ROOM_SUCCESS: 'join-room-success',
  LEAVE_ROOM: 'leave-room',
  MATCH_FOUND: 'match-found',
  PRIVATE_MESSAGE: 'private-message',
};

// Max EXP level for learning pathway
export const MAX_EXP = {
  Beginner: 200,
  Novice: 600,
  Expert: 1200,
  Elite: 6000,
};
