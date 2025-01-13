// AI command handler
async function handleAICommand(msg, args) {
    if (!args.length) {
        await msg.reply('Please provide a question');
        return;
    }

    const prompt = args.join(' ');
    try {
        // Send request to your API
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
