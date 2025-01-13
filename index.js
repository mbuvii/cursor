const { Client, NoAuth } = require('whatsapp-web.js');
const ytdl = require('ytdl-core');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./config/config');
const { formatDuration } = require('./utils/helpers');

// Initialize AI
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new NoAuth(),
    puppeteer: {
        args: ['--no-sandbox'],
    }
});

// Command handlers
const commandHandlers = {
    'play': handlePlayCommand,
    'ai': handleAICommand,
    'gpt': handleAICommand,
    'gemini': handleAICommand,
    'menu': handleMenuCommand,
    'alive': handleAliveCommand
};

client.on('ready', () => {
    console.log('Client is ready!');
    setOnlineStatus();
});

// Handle pairing code
async function handlePairing(number) {
    try {
        const code = await client.requestPairingCode(number);
        console.log(`Pairing code for ${number}: ${code}`);
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
    if (msg.body.startsWith('.')) {
        const [command, ...args] = msg.body.slice(1).split(' ');
        const handler = commandHandlers[command];
        
        if (handler) {
            await handler(msg, args);
        }
    }
});

// Initialize client
client.initialize();
