import { useEffect, useRef } from 'react';

// Emits "typing" once when the user starts, and "stop_typing" after 1.5s of silence.
export default function useTyping(sendTyping) {
  const isTyping = useRef(false);
  const timer = useRef(null);

  const stop = () => {
    clearTimeout(timer.current);
    if (isTyping.current) {
      isTyping.current = false;
      sendTyping(false);
    }
  };

  const notifyTyping = () => {
    if (!isTyping.current) {
      isTyping.current = true;
      sendTyping(true);
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(stop, 1500);
  };

  useEffect(() => () => clearTimeout(timer.current), []);
  return { notifyTyping, stopTyping: stop };
}
