export default function TypingIndicator({ users }) {
  if (users.length === 0) return <div className="typing-indicator placeholder" aria-hidden="true" />;

  const text = users.length === 1
    ? `${users[0]} is typing…`
    : users.length === 2
      ? `${users[0]} and ${users[1]} are typing…`
      : `${users.length} people are typing…`;

  return <div className="typing-indicator" role="status">{text}</div>;
}
