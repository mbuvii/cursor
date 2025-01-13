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

    const question = args.join(' ');
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(question);
        const response = await result.response;
        await msg.reply(response.text());
    } catch (error) {
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
