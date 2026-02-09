import { useEffect, useState } from 'react';

export default function Timer({ timeRemaining: initialTime }) {
    const [timeRemaining, setTimeRemaining] = useState(initialTime);

    useEffect(() => {
        setTimeRemaining(initialTime);
    }, [initialTime]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining(prev => Math.max(0, prev - 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (ms) => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const getPercentage = () => {
        const total = 24 * 60 * 60 * 1000; // 24 hours
        return (timeRemaining / total) * 100;
    };

    const getColor = () => {
        const percentage = getPercentage();
        if (percentage > 50) return 'var(--success)';
        if (percentage > 25) return 'var(--warning)';
        return 'var(--danger)';
    };

    return (
        <div className="timer">
            <div className="timer-icon">⏱️</div>
            <div className="timer-content">
                <div className="timer-label">Time Remaining</div>
                <div className="timer-value" style={{ color: getColor() }}>
                    {formatTime(timeRemaining)}
                </div>
                <div className="timer-bar">
                    <div
                        className="timer-progress"
                        style={{
                            width: `${getPercentage()}%`,
                            background: getColor()
                        }}
                    />
                </div>
            </div>

            <style jsx>{`
        .timer {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius);
        }

        .timer-icon {
          font-size: 24px;
        }

        .timer-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .timer-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .timer-value {
          font-size: 16px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }

        .timer-bar {
          width: 120px;
          height: 4px;
          background: var(--bg-tertiary);
          border-radius: 2px;
          overflow: hidden;
        }

        .timer-progress {
          height: 100%;
          transition: width 1s linear, background 0.3s ease;
          border-radius: 2px;
        }

        @media (max-width: 768px) {
          .timer {
            padding: 8px 12px;
          }

          .timer-icon {
            font-size: 20px;
          }

          .timer-value {
            font-size: 14px;
          }

          .timer-bar {
            width: 80px;
          }
        }
      `}</style>
        </div>
    );
}
