import { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../services/socket.js';
import { useSocket } from '../hooks/useSocket.js';

const DEFAULT_ROOMS = ['General', 'Technology', 'Gaming', 'Movies', 'Random'];

const ChatContext = createContext(null);

export function ChatProvider({ username, children }) {
  const { connected } = useSocket();
  const [rooms, setRooms] = useState(DEFAULT_ROOMS);
  const [currentRoom, setCurrentRoom] = useState('General');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Join/leave the current room and listen for its messages + users.
  useEffect(() => {
    if (!username) return;
    setMessages([]);
    socket.emit('join_room', { room: currentRoom, username });

    const onReceive = (msg) => {
      if (msg.room === currentRoom) setMessages((prev) => [...prev, msg]);
    };
    const onRoomUsers = (users) => setOnlineUsers(users);

    socket.on('receive_message', onReceive);
    socket.on('room_users', onRoomUsers);

    return () => {
      socket.off('receive_message', onReceive);
      socket.off('room_users', onRoomUsers);
      socket.emit('leave_room', { room: currentRoom });
    };
  }, [currentRoom, username]);

  const createRoom = (name) => {
    if (rooms.some((r) => r.toLowerCase() === name.toLowerCase())) return 'That room already exists.';
    setRooms([...rooms, name]);
    setCurrentRoom(name);
    return '';
  };

  const sendMessage = (text) => socket.emit('send_message', { room: currentRoom, text });

  const value = {
    username, connected, rooms, currentRoom, setCurrentRoom,
    messages, onlineUsers, createRoom, sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside a ChatProvider');
  return ctx;
}
