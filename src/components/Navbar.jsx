import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand" aria-label="BizCord home">
        <span className="brand-mark" aria-hidden="true">B</span>
        <span className="brand-name">BizCord</span>
      </Link>
    </header>
  );
}
