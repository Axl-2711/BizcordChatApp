const LABELS = {
  connected: 'Connected',
  connecting: 'Connecting…',
  reconnecting: 'Reconnecting…',
  unavailable: 'Server unavailable',
};

export default function ChatHeader({ room, status, onMenu }) {
  return (
    <header className="chat-header">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open rooms menu">☰</button>
      <h1># {room}</h1>
      <span className={`status ${status === 'connected' ? 'status-on' : 'status-off'}`} role="status">
        {LABELS[status]}
      </span>
    </header>
  );
}
