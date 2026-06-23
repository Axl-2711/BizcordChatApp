export default function RoomItem({ name, active, disabled, onSelect }) {
  return (
    <li>
      <button className={`room-item ${active ? 'active' : ''}`} onClick={onSelect}
        disabled={disabled} aria-current={active ? 'true' : undefined}>
        <span aria-hidden="true" className="hash">#</span>
        <span className="room-name">{name}</span>
      </button>
    </li>
  );
}
