export default function MessageList({ messages, currentUsername, onDownloadFile }) {
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image/')) return '🖼️';
        if (fileType.startsWith('video/')) return '🎥';
        if (fileType.startsWith('audio/')) return '🎵';
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
        return '📎';
    };

    return (
        <div className="message-list">
            {messages.map((message) => {
                if (message.type === 'system') {
                    return (
                        <div key={message.id} className="system-message fade-in">
                            <span className="system-text">{message.text}</span>
                        </div>
                    );
                }

                const isOwn = message.username === currentUsername;

                if (message.type === 'file') {
                    return (
                        <div key={message.id} className={`message fade-in ${isOwn ? 'own' : 'other'}`}>
                            <div className="message-bubble file-message">
                                <div className="message-header">
                                    <span className="username">{message.username}</span>
                                    <span className="timestamp">{formatTime(message.timestamp)}</span>
                                </div>
                                <div className="file-content">
                                    <div className="file-icon">{getFileIcon(message.fileType)}</div>
                                    <div className="file-info">
                                        <div className="file-name">{message.fileName}</div>
                                        <div className="file-size">{formatFileSize(message.fileSize)}</div>
                                    </div>
                                    <button
                                        className="btn-download"
                                        onClick={() => onDownloadFile(message)}
                                        title="Download file"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L10 9.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 12z" />
                                            <path d="M10 3a1 1 0 011 1v8a1 1 0 11-2 0V4a1 1 0 011-1z" />
                                            <path d="M4 14a1 1 0 011 1v1h10v-1a1 1 0 112 0v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a1 1 0 011-1z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={message.id} className={`message fade-in ${isOwn ? 'own' : 'other'}`}>
                        <div className="message-bubble">
                            <div className="message-header">
                                <span className="username">{message.username}</span>
                                <span className="timestamp">{formatTime(message.timestamp)}</span>
                            </div>
                            <div className="message-text">{message.text}</div>
                        </div>
                    </div>
                );
            })}

            <style jsx>{`
        .message-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .system-message {
          text-align: center;
          padding: 8px;
        }

        .system-text {
          font-size: 13px;
          color: var(--text-muted);
          background: var(--bg-secondary);
          padding: 6px 16px;
          border-radius: 16px;
          display: inline-block;
        }

        .message {
          display: flex;
          max-width: 70%;
        }

        .message.own {
          align-self: flex-end;
        }

        .message.other {
          align-self: flex-start;
        }

        .message-bubble {
          background: var(--bg-glass);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 12px 16px;
          box-shadow: 0 4px 12px var(--shadow);
        }

        .message.own .message-bubble {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          gap: 12px;
        }

        .username {
          font-size: 13px;
          font-weight: 600;
          color: var(--primary-light);
        }

        .timestamp {
          font-size: 11px;
          color: var(--text-muted);
        }

        .message-text {
          font-size: 15px;
          line-height: 1.5;
          word-wrap: break-word;
          color: var(--text-primary);
        }

        .file-message {
          min-width: 280px;
        }

        .file-content {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--bg-secondary);
          border-radius: var(--radius);
          margin-top: 8px;
        }

        .file-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .file-info {
          flex: 1;
          min-width: 0;
        }

        .file-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-size {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .btn-download {
          background: var(--primary);
          border: none;
          color: white;
          padding: 8px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .btn-download:hover {
          background: var(--primary-dark);
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .message {
            max-width: 85%;
          }

          .file-message {
            min-width: 240px;
          }
        }
      `}</style>
        </div>
    );
}
