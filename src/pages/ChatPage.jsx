import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import ChatHeader from '../components/ChatHeader.jsx';
import MessageList from '../components/MessageList.jsx';
import MessageInput from '../components/MessageInput.jsx';
import { ChatProvider, useChat } from '../context/ChatContext.jsx';

function ChatPageInner() {
  const navigate = useNavigate();
  const { username, connected, rooms, currentRoom, setCurrentRoom, messages, createRoom, sendMessage } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setSidebarOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

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

export default function ChatPage() {
  const { state } = useLocation();
  if (!state?.username) return <Navigate to="/" replace />;

  return (
    <ChatProvider username={state.username}>
      <ChatPageInner />
    </ChatProvider>
  );
}
