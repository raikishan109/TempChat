'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateChatCode } from '../lib/utils';

export default function HomePage() {
  const router = useRouter();
  const [chatCode, setChatCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleCreateRoom = () => {
    setIsCreating(true);
    const newCode = generateChatCode(12);
    setTimeout(() => {
      router.push(`/chat/${newCode}`);
    }, 300);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (chatCode.trim()) {
      router.push(`/chat/${chatCode.trim().toUpperCase()}`);
    }
  };

  if (!user) {
    return null; // Show nothing while redirecting
  }

  return (
    <div className="landing-page">
      <div className="container">
        <div className="hero">
          {/* Header */}
          <div className="header fade-in">
            <div className="header-content">
              <div className="logo">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="8" fill="url(#gradient)" />
                  <path d="M12 20L18 26L28 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40">
                      <stop stopColor="#6366f1" />
                      <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="logo-text">TempChat</span>
              </div>
              <div className="user-section">
                <span className="welcome-text">Welcome, {user.username}!</span>
                <button className="btn btn-secondary btn-logout" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="hero-content fade-in">
            <h1 className="hero-title">
              Anonymous, Encrypted,
              <br />
              <span className="gradient-text">Temporary Chat</span>
            </h1>
            <p className="hero-subtitle">
              Secure login. Real-time messaging. Auto-delete after 24 hours.
              <br />
              Just create an account and start chatting!
            </p>

            {/* Features */}
            <div className="features">
              <div className="feature">
                <div className="feature-icon">💬</div>
                <div className="feature-text">Real-Time Messaging</div>
              </div>
              <div className="feature">
                <div className="feature-icon">⏱️</div>
                <div className="feature-text">24-Hour Auto-Delete</div>
              </div>
              <div className="feature">
                <div className="feature-icon">💾</div>
                <div className="feature-text">MongoDB Storage</div>
              </div>
              <div className="feature">
                <div className="feature-icon">👤</div>
                <div className="feature-text">100% Anonymous</div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="action-cards">
              {/* Create Room */}
              <div className="card action-card slide-in">
                <h2 className="card-title">Create New Chat</h2>
                <p className="card-description">
                  Generate a unique chat code and share it with others
                </p>
                <button
                  className="btn btn-primary w-full"
                  onClick={handleCreateRoom}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <span className="spinner"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Create Chat Code
                    </>
                  )}
                </button>
              </div>

              {/* Join Room */}
              <div className="card action-card slide-in" style={{ animationDelay: '0.1s' }}>
                <h2 className="card-title">Join Existing Chat</h2>
                <p className="card-description">
                  Enter a chat code to join an existing room
                </p>
                <form onSubmit={handleJoinRoom}>
                  <input
                    type="text"
                    className="input mb-2"
                    placeholder="Enter chat code (e.g., ABC123XYZ456)"
                    value={chatCode}
                    onChange={(e) => setChatCode(e.target.value.toUpperCase())}
                    maxLength={20}
                  />
                  <button
                    type="submit"
                    className="btn btn-secondary w-full"
                    disabled={!chatCode.trim()}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" />
                    </svg>
                    Join Chat Room
                  </button>
                </form>
              </div>
            </div>

            {/* Security Notice */}
            <div className="security-notice fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="notice-icon">🛡️</div>
              <div className="notice-content">
                <h3>Privacy & Security</h3>
                <p>
                  All messages are stored securely in MongoDB with 24-hour auto-delete.
                  Real-time messaging powered by Socket.io.
                  Your data is automatically deleted after 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 40px 0;
        }

        .hero {
          width: 100%;
        }

        .header {
          margin-bottom: 60px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-text {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .welcome-text {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .btn-logout {
          padding: 8px 16px;
          font-size: 14px;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 56px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 20px;
          text-align: center;
        }

        .gradient-text {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 18px;
          color: var(--text-secondary);
          text-align: center;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 48px;
        }

        .feature {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          background: var(--bg-glass);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          transition: all 0.3s ease;
        }

        .feature:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2);
        }

        .feature-icon {
          font-size: 32px;
        }

        .feature-text {
          font-size: 14px;
          font-weight: 600;
          text-align: center;
        }

        .action-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .action-card {
          transition: all 0.3s ease;
        }

        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(99, 102, 241, 0.2);
        }

        .card-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .card-description {
          color: var(--text-secondary);
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .security-notice {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          gap: 20px;
          align-items: start;
        }

        .notice-icon {
          font-size: 40px;
          flex-shrink: 0;
        }

        .notice-content h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--primary-light);
        }

        .notice-content p {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 14px;
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 36px;
          }

          .hero-subtitle {
            font-size: 16px;
          }

          .features {
            grid-template-columns: repeat(2, 1fr);
          }

          .action-cards {
            grid-template-columns: 1fr;
          }

          .security-notice {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
