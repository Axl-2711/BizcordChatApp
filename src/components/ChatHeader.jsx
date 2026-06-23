import { useChat } from '../context/ChatContext.jsx';

const STATUS = {
  connected: ['Connected', 'ok'],
  connecting: ['Connecting...', 'warn'],
  reconnecting: ['Reconnecting...', 'warn'],
  error: ['Server unavailable', 'bad'],
};

export default function ChatHeader({ onMenu }) {
  const { currentRoom, onlineUsers, connectionStatus } = useChat();
  const [label, tone] = STATUS[connectionStatus] || STATUS.connecting;

  return (
    <header className="chat-header">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open rooms menu">☰</button>
      <div className="header-title">
        <h1># {currentRoom}</h1>
        <span className="muted small">{onlineUsers.length} online</span>
      </div>
      <span className={`status status-${tone}`} role="status">
        <span className="dot" aria-hidden="true" />
        {label}
      </span>
    </header>
  );
}
