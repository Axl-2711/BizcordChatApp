import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createSocket } from '../services/socket.js';
import { load, save, remove } from '../utils/storage.js';

const ChatContext = createContext(null);
const DEFAULT_ROOMS = ['General', 'Technology', 'Gaming', 'Movies', 'Random'];

export function ChatProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => load('bizcord_username'));
  const [currentRoom, setCurrentRoom] = useState(() => load('bizcord_room', 'General'));
  const [rooms, setRooms] = useState(DEFAULT_ROOMS);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [error, setError] = useState('');

  const socketRef = useRef(null);
  const roomRef = useRef(currentRoom); // latest room, readable inside socket listeners

  // Join (or create) a room. Resolves with an error message, or '' on success.
  const enterRoom = useCallback(
    (name, create = false) =>
      new Promise((resolve) => {
        const socket = socketRef.current;
        if (!socket || !socket.connected) return resolve('Not connected to the server.');
        socket.emit('join_room', { room: name, username: currentUser, create }, (res) => {
          if (!res.ok) return resolve(res.error);
          roomRef.current = res.room;
          setCurrentRoom(res.room);
          save('bizcord_room', res.room);
          setMessages(res.history);
          setOnlineUsers(res.users);
          setRooms(res.rooms);
          setTypingUsers([]);
          resolve('');
        });
      }),
    [currentUser]
  );

  // Connect once per user and clean up every listener on unmount/logout.
  useEffect(() => {
    if (!currentUser) return;
    const socket = createSocket();
    socketRef.current = socket;
    setConnectionStatus('connecting');

    const onConnect = async () => {
      setConnectionStatus('connected');
      const err = await enterRoom(roomRef.current); // also re-joins after a reconnect
      if (err) {
        setError(`${err} Moved you to General.`);
        await enterRoom('General');
      } else {
        setError('');
      }
    };
    const onDisconnect = (reason) =>
      setConnectionStatus(reason === 'io client disconnect' ? 'connecting' : 'reconnecting');
    const onConnectError = () => setConnectionStatus('error');

    const addSystem = (text) =>
      setMessages((prev) => [...prev, { id: `sys-${Date.now()}-${Math.random()}`, type: 'system', text }]);

    const onMessage = (msg) => {
      if (msg.room !== roomRef.current) return;
      setMessages((prev) => [...prev, msg]);
      setTypingUsers((prev) => prev.filter((u) => u !== msg.username));
    };
    const onJoined = (d) => d.room === roomRef.current && addSystem(`${d.username} joined the room`);
    const onLeft = (d) => d.room === roomRef.current && addSystem(`${d.username} left the room`);
    const onUsers = (d) => d.room === roomRef.current && setOnlineUsers(d.users);
    const onTyping = (d) =>
      d.room === roomRef.current && setTypingUsers((prev) => (prev.includes(d.username) ? prev : [...prev, d.username]));
    const onStopTyping = (d) => setTypingUsers((prev) => prev.filter((u) => u !== d.username));

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('receive_message', onMessage);
    socket.on('user_joined', onJoined);
    socket.on('user_left', onLeft);
    socket.on('room_users', onUsers);
    socket.on('typing', onTyping);
    socket.on('stop_typing', onStopTyping);
    socket.on('room_list', setRooms);

    return () => {
      socket.off();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUser, enterRoom]);

  const login = (username) => {
    save('bizcord_username', username);
    setCurrentUser(username);
  };

  const logout = () => {
    socketRef.current?.emit('leave_room');
    remove('bizcord_username');
    setCurrentUser('');
    setMessages([]);
    setOnlineUsers([]);
    setTypingUsers([]);
  };

  const sendMessage = (text) => socketRef.current?.emit('send_message', { text });
  const sendTyping = (isTyping) => socketRef.current?.emit(isTyping ? 'typing' : 'stop_typing');

  const value = {
    currentUser, currentRoom, rooms, messages, onlineUsers, typingUsers, connectionStatus, error,
    setError, login, logout, enterRoom, sendMessage, sendTyping,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside ChatProvider');
  return ctx;
}
