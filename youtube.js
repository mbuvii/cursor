const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

async function downloadYouTube(url, format, msg) {
    const videoInfo = await ytdl.getInfo(url);
    const videoTitle = videoInfo.videoDetails.title.replace(/[^\w\s]/gi, '');
    
    let options = {
        quality: format === 'audio' ? 'highestaudio' : 'highest',
    };

    if (format === 'audio') {
        options.filter = 'audioonly';
    }

    const tempPath = path.join(__dirname, '..', 'temp', `${videoTitle}.${format === 'audio' ? 'mp3' : 'mp4'}`);
    
    // Ensure temp directory exists
    if (!fs.existsSync(path.join(__dirname, '..', 'temp'))) {
        fs.mkdirSync(path.join(__dirname, '..', 'temp'));
    }

    await new Promise((resolve, reject) => {
        ytdl(url, options)
            .pipe(fs.createWriteStream(tempPath))
            .on('finish', resolve)
            .on('error', reject);
    });

    await msg.reply({
        media: fs.readFileSync(tempPath),
        caption: `${videoTitle}\nDownloaded by ${config.BOT_NAME}`
    });

    // Cleanup
    fs.unlinkSync(tempPath);
}

module.exports = {
    downloadYouTube
};
