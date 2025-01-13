const fetch = require('node-fetch');
const config = require('../config/config');
const { downloadYouTube } = require('../utils/youtube');

// Play command handler
async function handlePlayCommand(msg, args) {
    if (!args.length) {
        await msg.reply('Please provide a search term or YouTube URL');
        return;
    }

    const query = args.join(' ');
    try {
        const videoInfo = await ytdl.getInfo(query);
        const formats = videoInfo.formats;

        // Create buttons for format selection
        const buttons = [
            { id: 'audio', text: '🎵 Audio' },
            { id: 'video', text: '🎬 Video' }
        ];

        await msg.reply({
            text: `*${videoInfo.videoDetails.title}*\n\nChoose format:`,
            buttons: buttons
        });

    } catch (error) {
        await msg.reply('Error processing YouTube link. Please try again.');
    }
}

// AI command handler
async function handleAICommand(msg, args) {
    if (!args.length) {
        await msg.reply('Please provide a question');
        return;
    }

    const prompt = args.join(' ');
    try {
        const response = await fetch(`https://apigemini-a5cf3977cb14.herokuapp.com/api/generate?prompt=${encodeURIComponent(prompt)}`);
        
        if (!response.ok) {
            throw new Error('API response was not ok');
        }

        const data = await response.json();
        await msg.reply(data.response || data.text || 'No response from AI');
        
    } catch (error) {
        console.error('AI Error:', error);
        await msg.reply('Error getting AI response. Please try again.');
    }
}

// Menu command handler
async function handleMenuCommand(msg) {
    const menuText = `
*${config.BOT_NAME} Commands*

*.play* - Download YouTube videos/songs
*.ai* - Ask AI (Gemini)
*.gpt* - Ask AI (GPT)
*.gemini* - Ask AI (Gemini)
*.menu* - Show this menu
*.alive* - Check bot status

Made with ❤️ by ${config.OWNER_NUMBER}
    `;
    
    await msg.reply(menuText);
}

// Alive command handler
async function handleAliveCommand(msg) {
    const uptime = formatDuration(Date.now() - config.START_TIME);
    const aliveText = `
*${config.BOT_NAME}*

*Status:* Online ✅
*Uptime:* ${uptime}
*Platform:* ${process.env.PLATFORM || 'Heroku'}
*Owner:* ${config.OWNER_NUMBER}
    `;
    
    await msg.reply(aliveText);
}

module.exports = {
    handlePlayCommand,
    handleAICommand,
    handleMenuCommand,
    handleAliveCommand
};
