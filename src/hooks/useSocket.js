import { useEffect, useState } from 'react';
import { socket } from '../services/socket.js';

// Tracks connection status: 'connecting' | 'connected' | 'reconnecting' | 'unavailable'
export function useSocket() {
  const [status, setStatus] = useState(socket.connected ? 'connected' : 'connecting');

  useEffect(() => {
    const onConnect = () => setStatus('connected');
    const onDisconnect = (reason) => {
      if (reason !== 'io client disconnect') setStatus('reconnecting');
    };
    const onAttempt = () => setStatus('reconnecting');
    const onFailed = () => setStatus('unavailable');
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.io.on('reconnect_attempt', onAttempt);
    socket.io.on('reconnect_failed', onFailed);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.io.off('reconnect_attempt', onAttempt);
      socket.io.off('reconnect_failed', onFailed);
    };
  }, []);

  // Manual retry after the server was marked unavailable.
  const retry = () => {
    setStatus('reconnecting');
    socket.connect();
  };

  return { socket, status, connected: status === 'connected', retry };
}
