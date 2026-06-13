export default function ChatHeader({ room, onMenu }) {
  return (
    <header className="chat-header">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open rooms menu">☰</button>
      <h1># {room}</h1>
    </header>
  );
}
