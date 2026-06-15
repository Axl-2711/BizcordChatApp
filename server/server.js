import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.get('/', (req, res) => res.send('BizCord server is running'));
app.get('/health', (req, res) => res.json({ ok: true }));

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: 'http://localhost:5173' } });

// room -> Map(socketId -> username)
const rooms = new Map();

function usersIn(room) {
  return [...(rooms.get(room)?.values() ?? [])];
}

io.on('connection', (socket) => {
  socket.on('join_room', ({ room, username }) => {
    const prevRoom = socket.data.room;
    if (prevRoom) leaveRoom(socket, prevRoom);

    socket.join(room);
    socket.data.room = room;
    socket.data.username = username;

    if (!rooms.has(room)) rooms.set(room, new Map());
    rooms.get(room).set(socket.id, username);

    socket.to(room).emit('user_joined', { username });
    io.to(room).emit('room_users', usersIn(room));
  });

  socket.on('leave_room', ({ room }) => leaveRoom(socket, room));

  socket.on('send_message', ({ room, text }) => {
    if (!room || !text || !text.trim()) return;
    const message = {
      id: `${socket.id}-${Date.now()}`,
      room,
      text: text.trim(),
      username: socket.data.username,
      socketId: socket.id,
      timestamp: Date.now(),
    };
    io.to(room).emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    if (socket.data.room) leaveRoom(socket, socket.data.room);
  });

  function leaveRoom(socket, room) {
    socket.leave(room);
    const members = rooms.get(room);
    if (members) {
      members.delete(socket.id);
      if (members.size === 0) rooms.delete(room);
    }
    socket.to(room).emit('user_left', { username: socket.data.username });
    io.to(room).emit('room_users', usersIn(room));
    if (socket.data.room === room) socket.data.room = null;
  }
});

httpServer.listen(PORT, () => console.log(`BizCord server running on http://localhost:${PORT}`));
