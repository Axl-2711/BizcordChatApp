import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import ChatHeader from '../components/ChatHeader.jsx';
import MessageList from '../components/MessageList.jsx';
import MessageInput from '../components/MessageInput.jsx';

const DEFAULT_ROOMS = ['General', 'Technology', 'Gaming', 'Movies', 'Random'];

export default function ChatPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState(DEFAULT_ROOMS);
  const [currentRoom, setCurrentRoom] = useState('General');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setSidebarOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!state?.username) return <Navigate to="/" replace />;

  // Returns an error message, or '' when the room was created.
  const createRoom = (name) => {
    if (rooms.some((r) => r.toLowerCase() === name.toLowerCase())) return 'That room already exists.';
    setRooms([...rooms, name]);
    setCurrentRoom(name);
    return '';
  };

  return (
    <div className="chat-layout">
      <Sidebar
        username={state.username}
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
        <ChatHeader room={currentRoom} onMenu={() => setSidebarOpen(true)} />
        <MessageList room={currentRoom} />
        <MessageInput room={currentRoom} />
      </main>
    </div>
  );
}
