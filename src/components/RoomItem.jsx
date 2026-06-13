export default function RoomItem({ name, active, onSelect }) {
  return (
    <li>
      <button className={`room-item ${active ? 'active' : ''}`} onClick={onSelect}
        aria-current={active ? 'true' : undefined}>
        <span aria-hidden="true" className="hash">#</span>
        <span className="room-name">{name}</span>
      </button>
    </li>
  );
}
