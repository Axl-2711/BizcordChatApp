import { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../services/socket.js';
import { useSocket } from '../hooks/useSocket.js';

const DEFAULT_ROOMS = ['General', 'Technology', 'Gaming', 'Movies', 'Random'];

const ROOM_KEY = 'bizcord_last_room';
const CUSTOM_KEY = 'bizcord_custom_rooms';

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
}

const ChatContext = createContext(null);

export function ChatProvider({ username, children }) {
  const { status, connected, retry } = useSocket();
  const [rooms, setRooms] = useState(() => [...DEFAULT_ROOMS, ...load(CUSTOM_KEY, [])]);
  const [currentRoom, setCurrentRoom] = useState(() => {
    const last = load(ROOM_KEY, 'General');
    return [...DEFAULT_ROOMS, ...load(CUSTOM_KEY, [])].includes(last) ? last : 'General';
  });
  const [roomError, setRoomError] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  // Join/leave the current room and listen for its messages, users, and typing.
  useEffect(() => {
    if (!username) return;
    setMessages([]);
    setTypingUsers([]);
    setRoomError('');
    save(ROOM_KEY, currentRoom);

    // (Re)join whenever we connect - the server forgets us after a disconnect.
    const join = () => {
      socket.emit('join_room', { room: currentRoom, username }, (res) => {
        if (res?.error) {
          setRoomError(`${res.error} Switched back to General.`);
          setCurrentRoom('General');
        } else if (res?.history) {
          setMessages(res.history);
        }
      });
    };
    if (socket.connected) join();
    socket.on('connect', join);

    const onReceive = (msg) => {
      if (msg.room === currentRoom) setMessages((prev) => [...prev, msg]);
    };
    const onRoomUsers = (users) => setOnlineUsers(users);
    const onTyping = ({ username: who }) => {
      setTypingUsers((prev) => (prev.includes(who) ? prev : [...prev, who]));
    };
    const onStopTyping = ({ username: who }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== who));
    };

    socket.on('receive_message', onReceive);
    socket.on('room_users', onRoomUsers);
    socket.on('typing', onTyping);
    socket.on('stop_typing', onStopTyping);

    return () => {
      socket.off('connect', join);
      socket.off('receive_message', onReceive);
      socket.off('room_users', onRoomUsers);
      socket.off('typing', onTyping);
      socket.off('stop_typing', onStopTyping);
      if (socket.connected) socket.emit('leave_room', { room: currentRoom });
    };
  }, [currentRoom, username]);

  const createRoom = (name) => {
    name = name.trim();
    if (!name) return 'Room name is required.';
    if (name.length > 24) return 'Room name must be 24 characters or fewer.';
    if (rooms.some((r) => r.toLowerCase() === name.toLowerCase())) return 'That room already exists.';
    setRooms([...rooms, name]);
    save(CUSTOM_KEY, [...rooms, name].filter((r) => !DEFAULT_ROOMS.includes(r)));
    setCurrentRoom(name);
    return '';
  };

  const sendMessage = (text) => socket.emit('send_message', { room: currentRoom, text });
  const startTyping = () => socket.emit('typing', { room: currentRoom });
  const stopTyping = () => socket.emit('stop_typing', { room: currentRoom });

  const value = {
    username, status, connected, retry, roomError, setRoomError, rooms, currentRoom, setCurrentRoom,
    messages, onlineUsers, typingUsers, createRoom, sendMessage,
    startTyping, stopTyping,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside a ChatProvider');
  return ctx;
}
