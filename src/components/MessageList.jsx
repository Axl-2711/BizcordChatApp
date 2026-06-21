import { useEffect, useRef } from 'react';

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Group consecutive messages from the same sender so we don't repeat the name/avatar.
function groupMessages(messages) {
  return messages.map((msg, i) => {
    const prev = messages[i - 1];
    const startsGroup = !prev || prev.username !== msg.username;
    return { ...msg, startsGroup };
  });
}

export default function MessageList({ room, messages, username }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="message-list" role="log" aria-label={`Messages in ${room}`}>
        <div className="empty">
          <h2>Welcome to #{room}</h2>
          <p className="muted">No messages yet. Say hello!</p>
        </div>
      </div>
    );
  }

  const grouped = groupMessages(messages);

  return (
    <div className="message-list list" role="log" aria-label={`Messages in ${room}`}>
      {grouped.map((msg) => {
        const own = msg.username === username;
        return (
          <div key={msg.id} className={`bubble ${own ? 'own' : ''} ${msg.startsGroup ? '' : 'grouped'}`}>
            {!own && msg.startsGroup && <span className="bubble-sender">{msg.username}</span>}
            <p className="bubble-text">{msg.text}</p>
            <span className="bubble-time">{formatTime(msg.timestamp)}</span>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
