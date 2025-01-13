const express = require('express');
const { Client, NoAuth } = require('whatsapp-web.js');
const ytdl = require('ytdl-core');
const fetch = require('node-fetch');
const config = require('./config/config');
const { formatDuration } = require('./utils/helpers');
const { downloadYouTube } = require('./utils/youtube');
const { 
    handlePlayCommand, 
    handleAICommand, 
    handleMenuCommand, 
    handleAliveCommand 
} = require('./commands/handlers');

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Express routes
app.get('/', (req, res) => {
    res.send('WhatsApp Bot Server is Running!');
});

// Start Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new NoAuth(),
    puppeteer: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ],
        headless: true
    }
});

// Command handlers mapping
const commandHandlers = {
    'play': handlePlayCommand,
    'ai': handleAICommand,
    'gpt': handleAICommand,
    'gemini': handleAICommand,
    'menu': handleMenuCommand,
    'alive': handleAliveCommand
};

// Client event handlers
client.on('ready', () => {
    console.log('Client is ready!');
    setOnlineStatus();
});

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('disconnected', (reason) => {
    console.log('Client was disconnected', reason);
});

// Handle pairing code
async function handlePairing(number) {
    const cleanNumber = number.replace('+', '').trim();
    try {
        const code = await client.requestPairingCode(cleanNumber);
        console.log(`Pairing code for ${cleanNumber}: ${code}`);
        return code;
    } catch (error) {
        console.error('Error generating pairing code:', error);
        return null;
    }
}

// Set always online status
async function setOnlineStatus() {
    try {
        await client.sendPresenceAvailable();
        // Refresh every 5 minutes
        setTimeout(setOnlineStatus, 300000);
    } catch (error) {
        console.error('Error setting online status:', error);
    }
}

// Message handler
client.on('message', async msg => {
    try {
        if (msg.body.startsWith('.')) {
            const [command, ...args] = msg.body.slice(1).split(' ');
            const handler = commandHandlers[command.toLowerCase()];
            
            if (handler) {
                console.log(`Executing command: ${command}`);
                await handler(msg, args);
            }
        }
    } catch (error) {
        console.error('Error handling message:', error);
        await msg.reply('An error occurred while processing your command.');
    }
});

// Status monitor
client.on('status.update', async status => {
    console.log('Status update:', status);
});

// Error handler
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Initialize client
client.initialize().catch(err => {
    console.error('Client initialization failed:', err);
});

// Keep the process alive
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Keeping process alive.');
});

// Export for potential external use
module.exports = {
    client,
    handlePairing
};
