export const STATUS_CODE_CREATED = 201;
export const STATUS_CODE_CONFLICT = 409;
export const STATUS_CODE_LOGGED_IN = 200;
export const STATUS_CODE_LOGIN_FAILED = 401;
export const STATUS_CODE_LOGGED_OUT = 200;
export const STATUS_CODE_LOG_OUT_FAILED = 401;
export const STATUS_CODE_DELETED = 200;
export const STATUS_CODE_SUCCESS = 200;

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
