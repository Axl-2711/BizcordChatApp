export default function EmptyChat({ room, alone }) {
  return (
    <div className="empty">
      <h2>No messages in #{room} yet</h2>
      <p className="muted">
        {alone ? "You're the only one here. Send a message, then open another tab to see it live." : 'Be the first to say something.'}
      </p>
    </div>
  );
}
