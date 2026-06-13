// Placeholder: real messages arrive in Stage 3.
export default function MessageList({ room }) {
  return (
    <div className="message-list" role="log" aria-label={`Messages in ${room}`}>
      <div className="empty">
        <h2>Welcome to #{room}</h2>
        <p className="muted">Messages will appear here once real-time chat is added.</p>
      </div>
    </div>
  );
}
