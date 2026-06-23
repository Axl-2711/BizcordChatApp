import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ChatHeader from '../components/ChatHeader.jsx';
import MessageList from '../components/MessageList.jsx';
import TypingIndicator from '../components/TypingIndicator.jsx';
import MessageInput from '../components/MessageInput.jsx';

export default function ChatPage() {
  const { currentUser, error, setError, connectionStatus } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setSidebarOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!currentUser) return <Navigate to="/" replace />;

  return (
    <div className="chat-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}
      <main className="chat-main">
        <ChatHeader onMenu={() => setSidebarOpen(true)} />
        {connectionStatus === 'error' && (
          <div className="banner banner-error" role="alert">
            Can't reach the server. Make sure it is running on port 4000. Retrying...
          </div>
        )}
        {error && (
          <div className="banner banner-warn" role="alert">
            <span>{error}</span>
            <button className="link-btn" onClick={() => setError('')}>Dismiss</button>
          </div>
        )}
        <MessageList />
        <TypingIndicator />
        <MessageInput />
      </main>
    </div>
  );
}
