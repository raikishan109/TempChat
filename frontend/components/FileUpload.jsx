import { useRef } from 'react';

export default function FileUpload({ onFileSelect, disabled }) {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 100MB)
            const maxSize = 100 * 1024 * 1024;
            if (file.size > maxSize) {
                alert('File too large. Maximum size is 100MB.');
                return;
            }
            onFileSelect(file);
            // Reset input
            e.target.value = '';
        }
    };

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={disabled}
            />
            <button
                type="button"
                className="btn-file-upload"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                title="Upload file"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                </svg>
            </button>

            <style jsx>{`
        .btn-file-upload {
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 12px;
          border-radius: var(--radius);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-file-upload:hover:not(:disabled) {
          background: var(--bg-secondary);
          border-color: var(--primary);
          color: var(--primary);
          transform: scale(1.05);
        }

        .btn-file-upload:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
        </>
    );
}
