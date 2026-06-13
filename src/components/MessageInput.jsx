// Placeholder: sending messages is added in Stage 3.
export default function MessageInput({ room }) {
  return (
    <form className="message-input" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="message" className="sr-only">Message #{room}</label>
      <textarea id="message" rows={1} placeholder={`Message #${room} (coming soon)`} disabled />
      <button className="btn btn-primary" type="submit" disabled>Send</button>
    </form>
  );
}
