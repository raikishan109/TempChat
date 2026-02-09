/**
 * Utility Functions
 */

/**
 * Generate a random chat code
 * @param {number} length - Length of the code (default: 12)
 * @returns {string} - Random alphanumeric code
 */
export function generateChatCode(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomValues = crypto.getRandomValues(new Uint8Array(length));
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars[randomValues[i] % chars.length];
    }
    return code;
}

/**
 * Format file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted size (e.g., "1.5 MB")
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format timestamp to readable format
 * @param {Date|string} timestamp - Timestamp to format
 * @returns {string} - Formatted time (e.g., "2:30 PM")
 */
export function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}
