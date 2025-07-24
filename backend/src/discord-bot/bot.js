require('dotenv').config(); // Load environment variables

const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const DISCORD_TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.ChID;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// --- Database Connection ---
let db;
(async () => {
    try {
        // This will open or create the database file
        db = await open({
            filename: './wallets.db', // The database file
            driver: sqlite3.Database
        });
        // This creates the table if it doesn't exist already
        await db.exec('CREATE TABLE IF NOT EXISTS wallets (userId TEXT PRIMARY KEY, privateKey TEXT)');
        console.log('Successfully connected to the SQLite database.');
    } catch (err) {
        console.error('Failed to connect to SQLite:', err);
    }
})();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// When a message is created in Discord, emit it to Socket.IO clients
client.on('messageCreate', async message => {
    if (message.channel.id !== CHANNEL_ID) return;

    // --- MODIFICATION TO HANDLE EMBEDS ---
    // Check for embeds first, especially from other bots
    if (message.embeds.length > 0 && message.author.bot) {
        const embed = message.embeds[0];
        // Combine title and description from the embed
        const embedText = `${embed.title || ''} ${embed.description || ''}`.trim();
        
        if (embedText) {
            console.log(`Embed from ${message.author.username}: ${embedText}`);
            io.emit('newDiscordMessage', { user: message.author.username, text: embedText });
        }
        return; // Stop processing if we handled an embed
    }
    
    // Ignore messages from bots if they are not embeds
    if (message.author.bot) return;

    // --- Example: Add a wallet key ---
    // Command format: !addkey <the_private_key>
    if (message.content.startsWith('!addkey ')) {
        const key = message.content.split(' ')[1];
        const userId = message.author.id;

        try {
            // Use a parameterized query to prevent SQL injection
            await db.run('REPLACE INTO wallets (userId, privateKey) VALUES (?, ?)', userId, key);
            message.author.send('Your wallet key has been saved securely.'); // Send a DM
        } catch (err) {
            console.error('SQLite SET error:', err);
            message.channel.send('Sorry, there was an error saving your key.');
        }
        if (message.deletable) message.delete();
        return;
    }

    // --- Example: Get a wallet key ---
    // Command format: !getkey
    if (message.content === '!getkey') {
        const userId = message.author.id;
        try {
            const row = await db.get('SELECT privateKey FROM wallets WHERE userId = ?', userId);
            if (row) {
                message.author.send(`Your saved key is: ${row.privateKey}`); // Send key via DM
            } else {
                message.author.send("You don't have a key saved.");
            }
        } catch (err) {
            console.error('SQLite GET error:', err);
            message.channel.send('Sorry, there was an error retrieving your key.');
        }
        return;
    }

    // If it's a regular user message, send it
    console.log(`Discord Message from ${message.author.username}: ${message.content}`);
    io.emit('newDiscordMessage', { user: message.author.username, text: message.content });
    
    // Existing command sample:
    if (message.content === '!ping') {
        message.channel.send('Pong!');
    }
});

// Express API endpoint to send messages from frontend to Discord
app.post('/api/message', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).send('Message is required');
    }
    try {
        console.log('CHANNEL_ID from env:', CHANNEL_ID);
        let channel = client.channels.cache.get(CHANNEL_ID);
        if (!channel) {
            console.log('Channel not found in cache. Fetching channel...');
            channel = await client.channels.fetch(CHANNEL_ID);
        }
        console.log('Sending message:', message, 'to channel:', channel.name || 'unknown');
        await channel.send(message);
        res.status(200).send('Message sent to Discord');
    } catch (err) {
        console.error('Failed to send message:', err);
        res.status(500).send('Error sending message to Discord: ' + err.message);
    }
});

// Create HTTP server and wrap Express app
const server = http.createServer(app);

// Add this cors configuration to your Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "*", // Allow connections from any origin
        methods: ["GET", "POST"]
    }
});

client.login(DISCORD_TOKEN);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Frontend socket.io-client installation command (to be run in the frontend directory)
// npm install socket.io-client
