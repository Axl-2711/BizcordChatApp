import { Link, Navigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

// Placeholder: the real chat layout is built in Stage 2.
export default function ChatPage() {
  const { state } = useLocation();
  if (!state?.username) return <Navigate to="/" replace />;

  return (
    <div className="app-shell">
      <Navbar />
      <main className="page">
        <h1>Hi, {state.username}</h1>
        <p className="muted">The chat rooms are coming soon.</p>
        <Link to="/" className="btn">Back to join page</Link>
      </main>
    </div>
  );
}
