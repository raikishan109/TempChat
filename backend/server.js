/**
 * Real-time Chat Server with MongoDB
 * Socket.io + Express + MongoDB
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const { User, Room, Message } = require('./models');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/privatechat';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// REST API Routes

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'TempChat Backend API is running! 🚀',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth/login, /api/auth/signup',
            rooms: '/api/rooms, /api/rooms/:code',
            messages: '/api/rooms/:code/messages'
        }
    });
});

// ============ AUTHENTICATION ROUTES ============

// Signup
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({ error: 'Username must be 3-20 characters' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Create user (password stored as plain text - add bcrypt in production!)
        const user = await User.create({
            username,
            password,
            displayName: username
        });

        res.json({
            success: true,
            user: {
                username: user.username,
                displayName: user.displayName
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Check password (plain text comparison - use bcrypt in production!)
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        res.json({
            success: true,
            user: {
                username: user.username,
                displayName: user.displayName
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============ ROOM ROUTES ============

// Get room info
app.get('/api/rooms/:code', async (req, res) => {
    try {
        const room = await Room.findOne({ code: req.params.code.toUpperCase() });
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get messages for a room
app.get('/api/rooms/:code/messages', async (req, res) => {
    try {
        const messages = await Message.find({
            roomCode: req.params.code.toUpperCase()
        }).sort({ timestamp: 1 }).limit(500);

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create room
app.post('/api/rooms', async (req, res) => {
    try {
        const { code } = req.body;
        const room = await Room.create({ code: code.toUpperCase() });
        res.json(room);
    } catch (error) {
        if (error.code === 11000) {
            // Room already exists
            const room = await Room.findOne({ code: req.body.code.toUpperCase() });
            return res.json(room);
        }
        res.status(500).json({ error: error.message });
    }
});

// Delete room
app.delete('/api/rooms/:code', async (req, res) => {
    try {
        const roomCode = req.params.code.toUpperCase();

        // Delete all messages in the room
        await Message.deleteMany({ roomCode });

        // Delete the room
        await Room.findOneAndDelete({ code: roomCode });

        res.json({ success: true, message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Socket.io Real-time Communication
const activeUsers = new Map(); // roomCode -> Set of usernames

io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join room
    socket.on('join-room', async (data) => {
        const { roomCode, username } = data;
        const upperRoomCode = roomCode.toUpperCase();

        try {
            // Create room if doesn't exist
            await Room.findOneAndUpdate(
                { code: upperRoomCode },
                { code: upperRoomCode },
                { upsert: true, new: true }
            );

            // Join socket room
            socket.join(upperRoomCode);
            socket.roomCode = upperRoomCode;
            socket.username = username;

            // Track active users
            if (!activeUsers.has(upperRoomCode)) {
                activeUsers.set(upperRoomCode, new Set());
            }

            // Check if user was already in room (reconnect/refresh)
            const wasAlreadyInRoom = activeUsers.get(upperRoomCode).has(username);
            activeUsers.get(upperRoomCode).add(username);

            console.log(`👤 ${username} ${wasAlreadyInRoom ? 'reconnected to' : 'joined'} room ${upperRoomCode}`);

            // Send room joined confirmation
            socket.emit('room-joined', {
                roomCode: upperRoomCode,
                username
            });

            // Only notify others if this is a NEW join (not a reconnect)
            if (!wasAlreadyInRoom) {
                const systemMessage = await Message.create({
                    roomCode: upperRoomCode,
                    type: 'system',
                    username: 'System',
                    text: `${username} joined the chat`,
                    timestamp: new Date()
                });

                io.to(upperRoomCode).emit('new-message', systemMessage);
            }

            // Send active user count
            const userCount = activeUsers.get(upperRoomCode).size;
            io.to(upperRoomCode).emit('user-count', userCount);

        } catch (error) {
            console.error('Error joining room:', error);
            socket.emit('error', { message: error.message });
        }
    });

    // Send message
    socket.on('send-message', async (data) => {
        try {
            const { roomCode, username, text, type = 'text' } = data;
            const upperRoomCode = roomCode.toUpperCase();

            const message = await Message.create({
                roomCode: upperRoomCode,
                type,
                username,
                text,
                timestamp: new Date()
            });

            // Broadcast to all users in room
            io.to(upperRoomCode).emit('new-message', message);

            console.log(`💬 Message in ${upperRoomCode} from ${username}`);

        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: error.message });
        }
    });

    // Send file
    socket.on('send-file', async (data) => {
        try {
            const { roomCode, username, fileName, fileType, fileSize, fileData } = data;
            const upperRoomCode = roomCode.toUpperCase();

            // Check file size (max 10MB for MongoDB)
            if (fileSize > 10 * 1024 * 1024) {
                socket.emit('error', { message: 'File too large. Maximum 10MB allowed.' });
                return;
            }

            const message = await Message.create({
                roomCode: upperRoomCode,
                type: 'file',
                username,
                fileName,
                fileType,
                fileSize,
                fileData, // Base64 encoded
                timestamp: new Date()
            });

            // Broadcast to all users in room
            io.to(upperRoomCode).emit('new-message', message);

            console.log(`📎 File shared in ${upperRoomCode} by ${username}: ${fileName}`);

        } catch (error) {
            console.error('Error sending file:', error);
            socket.emit('error', { message: error.message });
        }
    });

    // Typing indicator
    socket.on('typing', (data) => {
        const { roomCode, username } = data;
        socket.to(roomCode.toUpperCase()).emit('user-typing', { username });
    });

    socket.on('stop-typing', (data) => {
        const { roomCode, username } = data;
        socket.to(roomCode.toUpperCase()).emit('user-stop-typing', { username });
    });

    // Disconnect
    socket.on('disconnect', async () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);

        if (socket.roomCode && socket.username) {
            const roomCode = socket.roomCode;
            const username = socket.username;

            // Wait 3 seconds before removing user (in case of page refresh/reconnect)
            setTimeout(async () => {
                // Check if user has reconnected
                if (activeUsers.has(roomCode)) {
                    const roomUsers = activeUsers.get(roomCode);

                    // Only remove and notify if user hasn't reconnected
                    if (roomUsers.has(username)) {
                        // Check if there are any other sockets with same username
                        const socketsInRoom = await io.in(roomCode).fetchSockets();
                        const userStillConnected = socketsInRoom.some(s => s.username === username);

                        if (!userStillConnected) {
                            // User truly left
                            roomUsers.delete(username);

                            if (roomUsers.size === 0) {
                                activeUsers.delete(roomCode);
                            }

                            // Notify others
                            try {
                                const systemMessage = await Message.create({
                                    roomCode,
                                    type: 'system',
                                    username: 'System',
                                    text: `${username} left the chat`,
                                    timestamp: new Date()
                                });

                                io.to(roomCode).emit('new-message', systemMessage);

                                // Send updated user count
                                const userCount = activeUsers.has(roomCode) ? activeUsers.get(roomCode).size : 0;
                                io.to(roomCode).emit('user-count', userCount);

                            } catch (error) {
                                console.error('Error on disconnect:', error);
                            }
                        }
                    }
                }
            }, 3000); // 3 second delay
        }
    });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.io endpoint: http://localhost:${PORT}`);
    console.log(`💾 MongoDB: ${MONGODB_URI}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});
