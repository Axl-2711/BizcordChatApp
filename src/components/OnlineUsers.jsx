export default function OnlineUsers({ users }) {
  return (
    <div>
      <div className="section-head">
        <h2>Online ({users.length})</h2>
      </div>
      {users.length === 0 ? (
        <p className="muted small">No users online.</p>
      ) : (
        <ul className="user-list">
          {users.map((name) => (
            <li key={name} className="user-item">
              <span className="dot" aria-hidden="true" />
              {name}
            </li>
          ))}
        </ul>
      )}
      {users.length === 1 && <p className="muted small">You're the only one in this room.</p>}
    </div>
  );
}
