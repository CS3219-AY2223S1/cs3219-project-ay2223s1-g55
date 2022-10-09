// IO/socketIOServer Event
export const IO_EVENT = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
};

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
  SEND_MESSAGE: 'send-message',
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  MATCH_FOUND: 'match-found',
  DISCONNECT: 'disconnect',
};
