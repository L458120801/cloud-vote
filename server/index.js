import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { nanoid } from 'nanoid';
import { db } from './db.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // In production, lock this down
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// API Routes

// Get all polls (simplified)
app.get('/api/polls', async (req, res) => {
    await db.read();
    // Return last 10 polls
    const recents = db.data.polls.slice(-10).reverse();
    res.json(recents);
});

// Create Poll
app.post('/api/polls', async (req, res) => {
    const { title, options } = req.body;
    if (!title || !options || !Array.isArray(options)) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    const newPoll = {
        id: nanoid(6), // Short ID for easier sharing
        title,
        options: options.map((opt, idx) => ({
            id: idx,
            text: opt,
            votes: 0
        })),
        createdAt: Date.now()
    };

    await db.read();
    db.data.polls.push(newPoll);
    await db.write();

    res.json(newPoll);
});

// Get single poll
app.get('/api/polls/:id', async (req, res) => {
    await db.read();
    const poll = db.data.polls.find(p => p.id === req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    res.json(poll);
});

// Vote
app.post('/api/polls/:id/vote', async (req, res) => {
    const { optionId } = req.body;
    await db.read();

    const poll = db.data.polls.find(p => p.id === req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    const option = poll.options.find(o => o.id === optionId);
    if (!option) return res.status(400).json({ error: 'Invalid option' });

    option.votes += 1;
    await db.write();

    // Notify everyone in the room
    io.to(poll.id).emit('update', poll);

    res.json(poll);
});

// WebSocket
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join', (pollId) => {
        socket.join(pollId);
        console.log(`Socket ${socket.id} joined room ${pollId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
