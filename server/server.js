import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const MAX_HISTORY = 200;
const MAX_MESSAGE = 500;

const app = express();
app.use(cors({ origin: CLIENT_URL }));
app.get('/health', (req, res) => res.json({ ok: true }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: CLIENT_URL } });

// All data lives in memory: it resets when the server restarts.
const rooms = new Map(); // name -> { messages: [], users: Map(socketId -> username) }
const createRoom = (name) => rooms.set(name, { messages: [], users: new Map() });
['General', 'Technology', 'Gaming', 'Movies', 'Random'].forEach(createRoom);

let nextId = 1;
const roomNames = () => [...rooms.keys()];
const usersIn = (name) => [...new Set(rooms.get(name)?.users.values() || [])];
const findRoom = (name) => roomNames().find((n) => n.toLowerCase() === name.toLowerCase());

function leaveCurrentRoom(socket) {
  const name = socket.data.room;
  if (!name) return;
  const room = rooms.get(name);
  socket.leave(name);
  socket.data.room = null;
  if (!room) return;
  room.users.delete(socket.id);
  const { username } = socket.data;
  io.to(name).emit('stop_typing', { room: name, username });
  io.to(name).emit('user_left', { room: name, username, timestamp: Date.now() });
  io.to(name).emit('room_users', { room: name, users: usersIn(name) });
}

io.on('connection', (socket) => {
  socket.on('join_room', (payload, ack = () => {}) => {
    const username = String(payload?.username || '').trim().slice(0, 20);
    const requested = String(payload?.room || '').trim();
    if (!username) return ack({ ok: false, error: 'Username is required.' });
    if (!requested || requested.length > 24) {
      return ack({ ok: false, error: 'Room name must be 1-24 characters.' });
    }

    const existing = findRoom(requested);
    if (payload.create && existing) return ack({ ok: false, error: 'That room already exists.' });
    if (!payload.create && !existing) return ack({ ok: false, error: 'Room not found.' });

    const name = existing || requested;
    if (!existing) {
      createRoom(name);
      io.emit('room_list', roomNames());
    }

    leaveCurrentRoom(socket);
    socket.data.username = username;
    socket.data.room = name;
    socket.join(name);
    rooms.get(name).users.set(socket.id, username);

    socket.to(name).emit('user_joined', { room: name, username, timestamp: Date.now() });
    io.to(name).emit('room_users', { room: name, users: usersIn(name) });
    ack({ ok: true, room: name, rooms: roomNames(), history: rooms.get(name).messages, users: usersIn(name) });
  });

  socket.on('leave_room', () => leaveCurrentRoom(socket));

  socket.on('send_message', ({ text } = {}) => {
    const name = socket.data.room;
    const clean = String(text || '').trim().slice(0, MAX_MESSAGE);
    if (!name || !clean) return;
    const message = { id: nextId++, room: name, username: socket.data.username, text: clean, timestamp: Date.now() };
    const room = rooms.get(name);
    room.messages.push(message);
    if (room.messages.length > MAX_HISTORY) room.messages.shift();
    io.to(name).emit('receive_message', message);
  });

  socket.on('typing', () => {
    const name = socket.data.room;
    if (name) socket.to(name).emit('typing', { room: name, username: socket.data.username });
  });

  socket.on('stop_typing', () => {
    const name = socket.data.room;
    if (name) socket.to(name).emit('stop_typing', { room: name, username: socket.data.username });
  });

  socket.on('disconnect', () => leaveCurrentRoom(socket));
});

server.listen(PORT, () => console.log(`BizCord server running on http://localhost:${PORT}`));
