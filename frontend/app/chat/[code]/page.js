'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import io from 'socket.io-client';
import MessageList from '../../../components/MessageList';
import FileUpload from '../../../components/FileUpload';
import Timer from '../../../components/Timer';

const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatCode = params.code;

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60 * 1000);
  const [username, setUsername] = useState('');
  const [typingUsers, setTypingUsers] = useState(new Set());

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Get username from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.username);
    } else {
      // Fallback to random username if not logged in
      setUsername(`User-${Math.random().toString(36).substr(2, 4).toUpperCase()}`);
    }
  }, []);

  useEffect(() => {
    if (!username) return; // Wait for username to be set
    initializeChat();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [chatCode, username]);

  const initializeChat = async () => {
    try {
      // Fetch existing messages
      const response = await fetch(`${SERVER_URL}/api/rooms/${chatCode}/messages`);
      if (response.ok) {
        const existingMessages = await response.json();
        setMessages(existingMessages);
      }

      // Connect to Socket.io
      const newSocket = io(SERVER_URL, {
        transports: ['websocket'],
        reconnection: true
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');

        // Join room
        newSocket.emit('join-room', {
          roomCode: chatCode,
          username
        });
      });

      newSocket.on('room-joined', (data) => {
        console.log('Joined room:', data);
        setIsConnecting(false);
      });

      newSocket.on('new-message', (message) => {
        setMessages(prev => [...prev, message]);
      });

      newSocket.on('user-count', (count) => {
        setUserCount(count);
      });

      newSocket.on('user-typing', (data) => {
        setTypingUsers(prev => new Set([...prev, data.username]));
      });

      newSocket.on('user-stop-typing', (data) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.username);
          return newSet;
        });
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
        setError(error.message);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      setSocket(newSocket);

    } catch (err) {
      console.error('Failed to initialize chat:', err);
      setError('Failed to connect to chat. Please try again.');
      setIsConnecting(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;

    socket.emit('send-message', {
      roomCode: chatCode,
      username,
      text: inputMessage.trim(),
      type: 'text'
    });

    setInputMessage('');

    // Stop typing indicator
    socket.emit('stop-typing', { roomCode: chatCode, username });
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

    if (!socket) return;

    // Send typing indicator
    socket.emit('typing', { roomCode: chatCode, username });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop-typing', { roomCode: chatCode, username });
    }, 2000);
  };

  const handleFileUpload = async (file) => {
    if (!socket) return;

    try {
      // Check file size (max 10MB for MongoDB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File too large. Maximum 10MB allowed.');
        return;
      }

      // Read file as base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result;

        socket.emit('send-file', {
          roomCode: chatCode,
          username,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileData: base64Data
        });
      };
      reader.readAsDataURL(file);

    } catch (err) {
      console.error('Failed to send file:', err);
      alert('Failed to send file.');
    }
  };

  const downloadFile = (message) => {
    try {
      // Create blob from base64
      const link = document.createElement('a');
      link.href = message.fileData;
      link.download = message.fileName;
      link.click();
    } catch (err) {
      console.error('Failed to download file:', err);
      alert('Failed to download file');
    }
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(chatCode);
    alert('Chat code copied to clipboard!');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (error) {
    return (
      <div className="error-page">
        <div className="error-content">
          <h1>❌ Connection Error</h1>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => router.push('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const typingUsersArray = Array.from(typingUsers).filter(u => u !== username);

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-header glass">
        <div className="header-left">
          <button className="btn-back" onClick={() => router.push('/')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" />
            </svg>
            <span>Back</span>
          </button>
          <div className="room-info">
            <h2 className="room-code" onClick={copyCodeToClipboard} title="Click to copy">
              🔒 {chatCode}
            </h2>
            <p className="room-status">
              {isConnecting ? (
                <span className="connecting">Connecting...</span>
              ) : (
                <span className="connected">
                  <span className="status-dot"></span>
                  {userCount} {userCount === 1 ? 'user' : 'users'} online
                </span>
              )}
            </p>
          </div>
        </div>
        <Timer timeRemaining={timeRemaining} />
      </div>

      {/* Messages */}
      <div className="chat-messages">
        <MessageList messages={messages} currentUsername={username} onDownloadFile={downloadFile} />

        {/* Typing Indicator */}
        {typingUsersArray.length > 0 && (
          <div className="typing-indicator">
            <span className="typing-text">
              {typingUsersArray.join(', ')} {typingUsersArray.length === 1 ? 'is' : 'are'} typing
              <span className="typing-dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input glass">
        <FileUpload onFileSelect={handleFileUpload} disabled={isConnecting} />
        <form onSubmit={sendMessage} className="message-form">
          <input
            type="text"
            className="input message-input"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={handleInputChange}
            disabled={isConnecting}
          />
          <button type="submit" className="btn btn-primary send-btn" disabled={isConnecting || !inputMessage.trim()}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>

      <style jsx>{`
        .chat-page {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .chat-header {
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          color: var(--text-primary);
          cursor: pointer;
          padding: 10px 16px;
          border-radius: var(--radius);
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 600;
        }

        .btn-back:hover {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
          transform: translateX(-2px);
        }

        .btn-back svg {
          flex-shrink: 0;
        }

        .btn-icon {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 8px;
          border-radius: var(--radius-sm);
          transition: all 0.3s ease;
        }

        .btn-icon:hover {
          background: var(--bg-tertiary);
          color: var(--primary);
        }

        .room-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .room-code {
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .room-code:hover {
          color: var(--primary);
        }

        .room-status {
          font-size: 14px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .connecting {
          color: var(--warning);
        }

        .connected {
          color: var(--success);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: var(--success);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .typing-indicator {
          padding: 8px 16px;
          margin-top: 8px;
        }

        .typing-text {
          font-size: 13px;
          color: var(--text-muted);
          font-style: italic;
        }

        .typing-dots {
          display: inline-block;
        }

        .typing-dots span {
          animation: blink 1.4s infinite;
          animation-fill-mode: both;
        }

        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes blink {
          0%, 80%, 100% { opacity: 0; }
          40% { opacity: 1; }
        }

        .chat-input {
          padding: 16px 24px;
          border-top: 1px solid var(--border);
          display: flex;
          gap: 12px;
        }

        .message-form {
          flex: 1;
          display: flex;
          gap: 12px;
        }

        .message-input {
          flex: 1;
          margin: 0;
        }

        .send-btn {
          padding: 12px 20px;
        }

        .error-page {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .error-content {
          text-align: center;
          max-width: 400px;
        }

        .error-content h1 {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .error-content p {
          color: var(--text-secondary);
          margin-bottom: 24px;
        }

        @media (max-width: 768px) {
          .chat-header {
            padding: 12px 16px;
          }

          .room-code {
            font-size: 14px;
          }

          .chat-messages {
            padding: 16px;
          }

          .chat-input {
            padding: 12px 16px;
          }
        }
      `}</style>
    </div>
  );
}
