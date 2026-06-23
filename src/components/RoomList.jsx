import { useState } from 'react';
import { useChat } from '../context/ChatContext.jsx';
import RoomItem from './RoomItem.jsx';

export default function RoomList({ onSelect }) {
  const { rooms, currentRoom, enterRoom, connectionStatus } = useChat();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const offline = connectionStatus !== 'connected';

  const handleSelect = async (room) => {
    if (room === currentRoom) return onSelect();
    const err = await enterRoom(room);
    if (err) return setError(err);
    onSelect();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setError('Room name is required.');
    if (trimmed.length > 24) return setError('Room name must be 24 characters or fewer.');
    if (rooms.some((r) => r.toLowerCase() === trimmed.toLowerCase())) return setError('That room already exists.');
    const err = await enterRoom(trimmed, true);
    if (err) return setError(err);
    setName('');
    setError('');
    setCreating(false);
    onSelect();
  };

  return (
    <nav className="section" aria-label="Rooms">
      <div className="section-head">
        <h2>Rooms</h2>
        <button className="icon-btn" onClick={() => { setCreating(!creating); setError(''); }}
          aria-label="Create a room" aria-expanded={creating}>＋</button>
      </div>

      {creating && (
        <form className="create-room" onSubmit={handleCreate} noValidate>
          <label htmlFor="room-name" className="sr-only">Room name</label>
          <input id="room-name" value={name} onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder="New room name" maxLength={24} autoFocus autoComplete="off" />
          <button className="btn btn-primary" type="submit" disabled={offline}>Create</button>
        </form>
      )}
      {error && <p className="field-error" role="alert">{error}</p>}

      <ul className="room-list">
        {rooms.map((room) => (
          <RoomItem key={room} name={room} active={room === currentRoom} disabled={offline}
            onSelect={() => handleSelect(room)} />
        ))}
      </ul>
    </nav>
  );
}
