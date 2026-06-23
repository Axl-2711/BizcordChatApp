import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext.jsx';
import { initial } from '../utils/format.js';
import RoomList from './RoomList.jsx';
import OnlineUsers from './OnlineUsers.jsx';

export default function Sidebar({ open, onClose }) {
  const { currentUser, logout } = useChat();
  const navigate = useNavigate();

  const handleLeave = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Rooms and people">
      <div className="sidebar-top">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">B</span>
          <span className="brand-name">BizCord</span>
        </div>
        <button className="icon-btn sidebar-close" onClick={onClose} aria-label="Close menu">✕</button>
      </div>

      <div className="profile">
        <span className="avatar" aria-hidden="true">{initial(currentUser)}</span>
        <div className="profile-info">
          <strong>{currentUser}</strong>
          <button className="link-btn" onClick={handleLeave}>Leave chat</button>
        </div>
      </div>

      <RoomList onSelect={onClose} />
      <OnlineUsers />
    </aside>
  );
}
