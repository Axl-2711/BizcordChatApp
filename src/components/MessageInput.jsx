import { useState } from 'react';
import { useChat } from '../context/ChatContext.jsx';
import useTyping from '../hooks/useTyping.js';

const MAX = 500;

export default function MessageInput() {
  const { sendMessage, sendTyping, currentRoom, connectionStatus } = useChat();
  const [text, setText] = useState('');
  const { notifyTyping, stopTyping } = useTyping(sendTyping);
  const connected = connectionStatus === 'connected';
  const canSend = connected && text.trim().length > 0;

  const submit = (e) => {
    e?.preventDefault();
    if (!canSend) return;
    sendMessage(text.trim());
    stopTyping();
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) submit(e); // Shift+Enter falls through as a newline
  };

  return (
    <form className="message-input" onSubmit={submit}>
      <label htmlFor="message" className="sr-only">Message #{currentRoom}</label>
      <textarea
        id="message"
        rows={1}
        value={text}
        maxLength={MAX}
        onChange={(e) => { setText(e.target.value); if (e.target.value.trim()) notifyTyping(); else stopTyping(); }}
        onKeyDown={handleKeyDown}
        onBlur={stopTyping}
        placeholder={connected ? `Message #${currentRoom}` : 'Waiting for connection...'}
        disabled={!connected}
      />
      <span className={`char-count ${text.length >= MAX ? 'limit' : ''}`} aria-label={`${text.length} of ${MAX} characters`}>
        {text.length}/{MAX}
      </span>
      <button className="btn btn-primary" type="submit" disabled={!canSend} aria-label="Send message">Send</button>
    </form>
  );
}
