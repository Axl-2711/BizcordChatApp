import { io } from 'socket.io-client';

const URL = 'http://localhost:4000';

// A single shared socket instance for the whole app.
export const socket = io(URL, {
  autoConnect: true,
  reconnectionAttempts: 5, // after 5 failed tries we show "server unavailable"
  reconnectionDelayMax: 3000,
});
