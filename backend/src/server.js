require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const initializeBot = require('./discord-bot/bot.js');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://thunderous-ganache-22791e.netlify.app",
        methods: ["GET", "POST"]
    },
    // Add these compatibility options
    transports: ['websocket', 'polling'],
    allowEIO3: true
});

// --- ADD THIS LOG ---
io.on('connection', (socket) => {
    console.log('[Backend] A user connected with socket ID:', socket.id);
    socket.on('disconnect', () => {
        console.log('[Backend] User disconnected:', socket.id);
    });
});

const discordClient = initializeBot(io);

app.post('/api/message', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).send('Message is required');
    
    try {
        const channel = await discordClient.channels.fetch(process.env.ChID);
        await channel.send(message);
        res.status(200).send('Message sent to Discord');
    } catch (err) {
        console.error('Failed to send message:', err);
        res.status(500).send('Error sending message to Discord');
    }
});

// This is the ONLY file that should have server.listen()
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});