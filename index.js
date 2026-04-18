const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();
const http = require('http');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const PREFIX = '!';

client.once('ready', () => {
    console.log(`DREADNOUGHT ONLINE: ${client.user.tag}`);
    client.user.setActivity('Dreadnought | Railway', { type: 3 });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'alive':
            const aliveEmbed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('DREADNOUGHT V2')
                .setDescription('✅ System Operational on Railway\n\n**Latency:** ' + client.ws.ping + 'ms')
                .setTimestamp();
            message.reply({ embeds: [aliveEmbed] });
            break;

        case 'bug':
            const bugMenu = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🐞 Bug Menu')
                .addFields(
                    { name: '!kill', value: 'Stops the bot.', inline: true },
                    { name: '!crash', value: 'Throws error.', inline: true },
                    { name: '!delay <ms>', value: 'Simulates lag.', inline: true }
                );
            message.reply({ embeds: [bugMenu] });
            break;

        case 'delay':
            const time = parseInt(args[0]) || 5000;
            message.reply(`⏳ Simulating ${time}ms delay...`);
            setTimeout(() => { message.channel.send('✅ Task resumed.'); }, time);
            break;

        case 'crash':
            message.channel.send('⚠️ Inducing Crash...');
            throw new Error('Dreadnought Manual Crash');

        case 'kill':
            await message.channel.send('🔌 Killing Session...');
            process.exit();
    }
});

// Basic error handling to prevent the bot from staying down
process.on('uncaughtException', (err) => {
    console.error('Bot Error:', err.message);
});

// --- RAILWAY HEALTH CHECK SERVER ---
// This keeps the Railway deployment marked as "Active"
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Dreadnought Bot is Running');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Health check server listening on port ${PORT}`);
});

client.login(process.env.DISCORD_TOKEN);
        
