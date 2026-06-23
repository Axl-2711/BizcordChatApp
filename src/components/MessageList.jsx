import { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext.jsx';
import MessageBubble from './MessageBubble.jsx';
import EmptyChat from './EmptyChat.jsx';

const GROUP_WINDOW = 5 * 60 * 1000; // group same-sender messages sent within 5 minutes

export default function MessageList() {
  const { messages, currentUser, currentRoom, onlineUsers } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const hasChat = messages.some((m) => m.type !== 'system');

  return (
    <div className="message-list" role="log" aria-live="polite" aria-label={`Messages in ${currentRoom}`}>
      {!hasChat && <EmptyChat room={currentRoom} alone={onlineUsers.length <= 1} />}
      {messages.map((msg, i) => {
        const prev = messages[i - 1];
        const showHeader =
          !prev || prev.type === 'system' || prev.username !== msg.username || msg.timestamp - prev.timestamp > GROUP_WINDOW;
        return <MessageBubble key={msg.id} message={msg} own={msg.username === currentUser} showHeader={showHeader} />;
      })}
      <div ref={bottomRef} />
    </div>
  );
}
