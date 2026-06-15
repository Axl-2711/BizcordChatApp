import { useEffect, useRef } from 'react';
import { socket } from '../services/socket.js';

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  return (
    <div className="message-list list" role="log" aria-label={`Messages in ${room}`}>
      {messages.map((msg) => {
        const own = msg.socketId === socket.id;
        return (
          <div key={msg.id} className={`bubble ${own ? 'own' : ''}`}>
            {!own && <span className="bubble-sender">{msg.username}</span>}
            <p className="bubble-text">{msg.text}</p>
            <span className="bubble-time">{formatTime(msg.timestamp)}</span>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
