import { io } from 'socket.io-client';

const URL = 'http://localhost:4000';

// A single shared socket instance for the whole app.
export const socket = io(URL, { autoConnect: true });
