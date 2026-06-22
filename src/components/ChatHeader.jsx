const LABELS = {
  connected: 'Connected',
  connecting: 'Connecting…',
  reconnecting: 'Reconnecting…',
  unavailable: 'Server unavailable',
};

export default function ChatHeader({ room, status, onMenu, menuOpen }) {
  return (
    <header className="chat-header">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open rooms menu" aria-controls="sidebar" aria-expanded={menuOpen}>☰</button>
      <h1># {room}</h1>
      <span className={`status ${status === 'connected' ? 'status-on' : 'status-off'}`} role="status">
        <span className="status-dot" aria-hidden="true" />
        {LABELS[status]}
      </span>
    </header>
  );
}
