import { useChat } from '../context/ChatContext.jsx';
import { initial } from '../utils/format.js';

export default function OnlineUsers() {
  const { onlineUsers, currentUser } = useChat();
  return (
    <section className="section users-section" aria-label="Online users">
      <div className="section-head">
        <h2>Online in this room</h2>
        <span className="count">{onlineUsers.length}</span>
      </div>
      {onlineUsers.length === 0 ? (
        <p className="muted small">No one is online yet.</p>
      ) : (
        <ul className="user-list">
          {onlineUsers.map((u) => (
            <li key={u}>
              <span className="avatar avatar-sm" aria-hidden="true">{initial(u)}</span>
              <span>{u}{u === currentUser && <span className="muted"> (you)</span>}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
