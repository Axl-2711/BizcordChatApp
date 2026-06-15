import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import ChatHeader from '../components/ChatHeader.jsx';
import MessageList from '../components/MessageList.jsx';
import MessageInput from '../components/MessageInput.jsx';
import { socket } from '../services/socket.js';

const DEFAULT_ROOMS = ['General', 'Technology', 'Gaming', 'Movies', 'Random'];

export default function ChatPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState(DEFAULT_ROOMS);
  const [currentRoom, setCurrentRoom] = useState('General');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(socket.connected);

  const username = state?.username;

  // Connection status.
  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  // Join/leave room, and listen for messages while in it.
  useEffect(() => {
    if (!username) return;
    setMessages([]);
    socket.emit('join_room', { room: currentRoom, username });

    const onReceive = (msg) => {
      if (msg.room === currentRoom) setMessages((prev) => [...prev, msg]);
    };
    socket.on('receive_message', onReceive);

    return () => {
      socket.off('receive_message', onReceive);
      socket.emit('leave_room', { room: currentRoom });
    };
  }, [currentRoom, username]);

  if (!username) return <Navigate to="/" replace />;

  const createRoom = (name) => {
    if (rooms.some((r) => r.toLowerCase() === name.toLowerCase())) return 'That room already exists.';
    setRooms([...rooms, name]);
    setCurrentRoom(name);
    return '';
  };

  const sendMessage = (text) => {
    socket.emit('send_message', { room: currentRoom, text });
  };

  return (
    <div className="chat-layout">
      <Sidebar
        username={username}
        rooms={rooms}
        currentRoom={currentRoom}
        open={sidebarOpen}
        onSelectRoom={(room) => { setCurrentRoom(room); setSidebarOpen(false); }}
        onCreateRoom={createRoom}
        onClose={() => setSidebarOpen(false)}
        onLeave={() => navigate('/')}
      />
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}
      <main className="chat-main">
        <ChatHeader room={currentRoom} connected={connected} onMenu={() => setSidebarOpen(true)} />
        <MessageList room={currentRoom} messages={messages} username={username} />
        <MessageInput room={currentRoom} onSend={sendMessage} disabled={!connected} />
      </main>
    </div>
  );
}
