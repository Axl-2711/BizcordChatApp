import { useState } from 'react';

export default function MessageInput({ room, onSend, disabled }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <label htmlFor="message" className="sr-only">Message #{room}</label>
      <textarea
        id="message"
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={disabled ? 'Connecting…' : `Message #${room}`}
        disabled={disabled}
      />
      <button className="btn btn-primary" type="submit" disabled={disabled || !text.trim()}>Send</button>
    </form>
  );
}
