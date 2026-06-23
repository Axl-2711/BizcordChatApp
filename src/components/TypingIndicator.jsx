import { useChat } from '../context/ChatContext.jsx';
import { typingText } from '../utils/format.js';

export default function TypingIndicator() {
  const { typingUsers } = useChat();
  return (
    <div className="typing" aria-live="polite">
      {typingText(typingUsers)}
    </div>
  );
}
