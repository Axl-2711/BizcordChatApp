import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import ChatHeader from '../components/ChatHeader.jsx';
import MessageList from '../components/MessageList.jsx';
import MessageInput from '../components/MessageInput.jsx';
import TypingIndicator from '../components/TypingIndicator.jsx';
import { ChatProvider, useChat } from '../context/ChatContext.jsx';

function ChatPageInner() {
  const navigate = useNavigate();
  const {
    username, status, connected, retry, roomError, setRoomError, rooms, currentRoom, setCurrentRoom, messages,
    onlineUsers, typingUsers, createRoom, sendMessage, startTyping, stopTyping,
  } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
    document.querySelector('.menu-btn')?.focus();
  };

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setSidebarOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="chat-layout">
      <a className="skip-link" href="#message">Skip to message input</a>
      <Sidebar
        username={username}
        rooms={rooms}
        currentRoom={currentRoom}
        onlineUsers={onlineUsers}
        open={sidebarOpen}
        onSelectRoom={(room) => { setCurrentRoom(room); setSidebarOpen(false); }}
        onCreateRoom={createRoom}
        onClose={closeSidebar}
        onLeave={() => navigate('/')}
      />
      {sidebarOpen && <div className="overlay" onClick={closeSidebar} aria-hidden="true" />}
      <main className="chat-main">
        <ChatHeader room={currentRoom} status={status} menuOpen={sidebarOpen} onMenu={() => setSidebarOpen(true)} />
        {status === 'unavailable' && (
          <div className="banner banner-error" role="alert">
            Can't reach the server. Make sure it is running (<code>npm run server</code>).
            <button className="btn" onClick={retry}>Retry</button>
          </div>
        )}
        {status === 'reconnecting' && <div className="banner" role="status">Connection lost. Reconnecting…</div>}
        {roomError && (
          <div className="banner banner-error" role="alert">
            {roomError}
            <button className="link-btn" onClick={() => setRoomError('')}>Dismiss</button>
          </div>
        )}
        <MessageList room={currentRoom} messages={messages} username={username} />
        <TypingIndicator users={typingUsers} />
        <MessageInput
          room={currentRoom}
          onSend={sendMessage}
          onTypingStart={startTyping}
          onTypingStop={stopTyping}
          disabled={!connected}
        />
      </main>
    </div>
  );
}

export default function ChatPage() {
  const { state } = useLocation();
  // After a refresh the router state is gone, so fall back to localStorage.
  let username = state?.username;
  if (!username) {
    try { username = localStorage.getItem('bizcord_username'); } catch { /* ignore */ }
  }
  if (!username) return <Navigate to="/" replace />;

  return (
    <ChatProvider username={username}>
      <ChatPageInner />
    </ChatProvider>
  );
}
