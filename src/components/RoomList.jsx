import { useState } from 'react';
import RoomItem from './RoomItem.jsx';

export default function RoomList({ rooms, currentRoom, onSelect, onCreate }) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setError('Room name is required.');
    if (trimmed.length > 24) return setError('Room name must be 24 characters or fewer.');
    const err = onCreate(trimmed);
    if (err) return setError(err);
    setName('');
    setError('');
    setCreating(false);
  };

  return (
    <nav aria-label="Rooms">
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
          <button className="btn btn-primary" type="submit">Create</button>
        </form>
      )}
      {error && <p className="field-error" role="alert">{error}</p>}

      <ul className="room-list">
        {rooms.map((room) => (
          <RoomItem key={room} name={room} active={room === currentRoom} onSelect={() => onSelect(room)} />
        ))}
      </ul>
    </nav>
  );
}
