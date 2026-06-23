import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext.jsx';

export default function JoinPage() {
  const { currentUser, login } = useChat();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (currentUser) return <Navigate to="/chat" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return setError('Enter a username to continue.');
    if (trimmed.length < 2) return setError('Username must be at least 2 characters.');
    if (trimmed.length > 20) return setError('Username must be 20 characters or fewer.');
    login(trimmed);
    navigate('/chat');
  };

  return (
    <main className="join-page">
      <div className="join-card">
        <div className="brand brand-lg">
          <span className="brand-mark" aria-hidden="true">B</span>
          <h1>BizCord</h1>
        </div>
        <p className="muted">Real-time chat rooms. Pick a name and start talking.</p>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder="e.g. Asha"
            maxLength={20}
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
  );
}
