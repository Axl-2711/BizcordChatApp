import { useEffect, useRef } from 'react';
import RoomList from './RoomList.jsx';
import OnlineUsers from './OnlineUsers.jsx';

export default function Sidebar({ username, rooms, currentRoom, onlineUsers, open, onSelectRoom, onCreateRoom, onClose, onLeave }) {
  const closeRef = useRef(null);
  // Move keyboard focus into the drawer when it opens (mobile only; the button is hidden on desktop).
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  return (
    <aside id="sidebar" className={`sidebar ${open ? 'open' : ''}`} aria-label="Sidebar">
      <div className="sidebar-top">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">B</span>
          <span className="brand-name">BizCord</span>
        </div>
        <button ref={closeRef} className="icon-btn sidebar-close" onClick={onClose} aria-label="Close menu">✕</button>
      </div>

      <div className="profile">
        <span className="avatar" aria-hidden="true">{username.charAt(0).toUpperCase()}</span>
        <div className="profile-info">
          <strong>{username}</strong>
          <button className="link-btn" onClick={onLeave}>Leave chat</button>
        </div>
      </div>

      <RoomList rooms={rooms} currentRoom={currentRoom} onSelect={onSelectRoom} onCreate={onCreateRoom} />
      <OnlineUsers users={onlineUsers} />
    </aside>
  );
}
