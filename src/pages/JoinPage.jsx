import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function JoinPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setError('Enter a username to continue.');
    if (trimmed.length < 2) return setError('Username must be at least 2 characters.');
    // The username is passed to the chat page through the router (no Context yet).
    navigate('/chat', { state: { username: trimmed } });
  };

  return (
    <div className="app-shell">
      <Navbar />
      <main className="join-page">
        <div className="card">
          <h1>Welcome to BizCord</h1>
          <p className="muted">Real-time chat rooms. Pick a name and start talking.</p>
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="e.g. Asha"
              autoFocus
              autoComplete="off"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'username-error' : undefined}
            />
            {error && <p id="username-error" className="field-error" role="alert">{error}</p>}
            <button type="submit" className="btn btn-primary btn-block">Join chat</button>
          </form>
        </div>
      </main>
    </div>
  );
}
