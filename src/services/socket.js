import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

// One socket per logged-in user. The context connects and disconnects it.
export function createSocket() {
  return io(SERVER_URL, { autoConnect: true, reconnectionDelay: 1000, reconnectionDelayMax: 5000 });
}
