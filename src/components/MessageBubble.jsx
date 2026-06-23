import { formatTime } from '../utils/format.js';

export default function MessageBubble({ message, own, showHeader }) {
  if (message.type === 'system') {
    return <p className="system-msg">{message.text}</p>;
  }
  return (
    <div className={`message ${own ? 'own' : 'other'} ${showHeader ? 'first' : ''}`}>
      {showHeader && (
        <div className="message-meta">
          <strong>{own ? 'You' : message.username}</strong>
          <time dateTime={new Date(message.timestamp).toISOString()}>{formatTime(message.timestamp)}</time>
        </div>
      )}
      <div className="bubble">{message.text}</div>
    </div>
  );
}
