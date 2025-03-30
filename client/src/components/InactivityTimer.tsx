import { useEffect, useState } from 'react';
import auth from '../utils/auth';

interface InactivityTimerProps {
  timeoutMinutes: number;
  countdownSeconds: number;
}

const InactivityTimer: React.FC<InactivityTimerProps> = ({ 
  timeoutMinutes = 2, 
  countdownSeconds = 30 
}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(countdownSeconds);
  let inactivityTimer: number | null = null;
  let countdownTimer: number | null = null;

  const resetTimer = () => {
    if (inactivityTimer) {
      window.clearTimeout(inactivityTimer);
    }
    if (countdownTimer) {
      window.clearInterval(countdownTimer);
    }
    setShowWarning(false);
    setCountdown(countdownSeconds);
    
    // Set timeout for user inactivity
    inactivityTimer = window.setTimeout(() => {
      startCountdown();
    }, timeoutMinutes * 60 * 1000);
  };

  const startCountdown = () => {
    setShowWarning(true);
    
    // Start countdown
    countdownTimer = window.setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          // Time's up, log the user out
          window.clearInterval(countdownTimer as number);
          auth.logout();
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    // Only monitor if user is logged in
    if (!auth.loggedIn()) return;

    // Setup event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Initialize the timer
    resetTimer();

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      if (inactivityTimer) window.clearTimeout(inactivityTimer);
      if (countdownTimer) window.clearInterval(countdownTimer);
    };
  }, []);

  if (!showWarning) return null;

  return (
    <div className="inactivity-warning">
      <div className="inactivity-warning-content">
        <h2>Session Timeout</h2>
        <p>Your session will expire in {countdown} seconds due to inactivity.</p>
        <p>Move your mouse or press any key to stay logged in.</p>
      </div>
    </div>
  );
};

export default InactivityTimer;