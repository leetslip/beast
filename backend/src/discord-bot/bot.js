require('dotenv').config(); // Load environment variables

const { Client, GatewayIntentBits } = require('discord.js');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

// This is the only function in this file. It does NOT start a server.
function initializeBot(io) {
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
    let db;

    (async () => {
        try {
            db = await open({ filename: './wallets.db', driver: sqlite3.Database });
            await db.exec('CREATE TABLE IF NOT EXISTS wallets (userId TEXT PRIMARY KEY, privateKey TEXT)');
            console.log('Successfully connected to the SQLite database.');
        } catch (err) {
            console.error('Failed to connect to SQLite:', err);
        }
    })();

    client.once('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.on('messageCreate', async message => {
        if (message.channel.id !== process.env.ChID) return;

        // Handle embeds from other bots
        if (message.embeds.length > 0 && message.author.bot) {
            const embed = message.embeds[0];
            const embedText = `${embed.title || ''} ${embed.description || ''}`.trim();
            if (embedText) {
                io.emit('newDiscordMessage', { user: message.author.username, text: embedText });
            }
            return;
        }
        
        if (message.author.bot) return;

        // Handle regular user messages
        io.emit('newDiscordMessage', { user: message.author.username, text: message.content });
    });

    client.login(process.env.TOKEN);

    // Return the client instance so server.js can use it
    return client;
}

// This line exports the function so server.js can use it.
module.exports = initializeBot;
