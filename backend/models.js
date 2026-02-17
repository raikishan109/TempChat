/**
 * MongoDB Models
 */

const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    displayName: {
        type: String,
        default: function () {
            return this.username;
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Auto-delete after 24 hours
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
});

// Room Schema
const roomSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Auto-delete after 24 hours
    }
});

// Message Schema
const messageSchema = new mongoose.Schema({
    roomCode: {
        type: String,
        required: true,
        uppercase: true,
        index: true
    },
    type: {
        type: String,
        enum: ['text', 'file', 'system'],
        default: 'text'
    },
    username: {
        type: String,
        required: true
    },
    text: String,
    fileName: String,
    fileType: String,
    fileSize: Number,
    fileData: String, // Base64 encoded
    timestamp: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Auto-delete after 24 hours
    }
});

// Indexes for better query performance
messageSchema.index({ roomCode: 1, timestamp: -1 });

const User = mongoose.model('User', userSchema);
const Room = mongoose.model('Room', roomSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = { User, Room, Message };
