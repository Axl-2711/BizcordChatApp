import { useEffect, useRef, useState } from 'react';

const MAX_LEN = 500;
const STOP_TYPING_DELAY = 1500;

export default function MessageInput({ room, onSend, onTypingStart, onTypingStop, disabled }) {
  const [text, setText] = useState('');
  const stopTimer = useRef(null);
  const isTyping = useRef(false);
  const areaRef = useRef(null);

  // Grow the textarea with its content (CSS caps the height).
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  // Always stop the "typing" signal, and clear any pending timer, when unmounting or switching rooms.
  useEffect(() => {
    return () => {
      clearTimeout(stopTimer.current);
      if (isTyping.current) onTypingStop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  const handleChange = (e) => {
    const value = e.target.value.slice(0, MAX_LEN);
    setText(value);

    if (!isTyping.current) {
      isTyping.current = true;
      onTypingStart();
    }
    clearTimeout(stopTimer.current);
    stopTimer.current = setTimeout(() => {
      isTyping.current = false;
      onTypingStop();
    }, STOP_TYPING_DELAY);
  };

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
    clearTimeout(stopTimer.current);
    isTyping.current = false;
    onTypingStop();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form className="message-input" onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <label htmlFor="message" className="sr-only">Message #{room}</label>
      <div className="input-wrap">
        <textarea
          id="message"
          ref={areaRef}
          rows={1}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Connecting…' : `Message #${room} (Enter to send, Shift+Enter for new line)`}
          disabled={disabled}
          maxLength={MAX_LEN}
        />
        <span className="char-count small muted" aria-hidden="true">{text.length}/{MAX_LEN}</span>
      </div>
      <button className="btn btn-primary" type="submit" disabled={disabled || !text.trim()}>Send</button>
    </form>
  );
}
