const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// Initialize the Discord Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Check for the Discord Token (Your "Bot Token")
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!DISCORD_TOKEN) {
    console.error("CRITICAL ERROR: DISCORD_TOKEN is missing in Railway Variables!");
    process.exit(1);
}

client.once('ready', () => {
    console.log(`DreadNought Discord is Online! Logged in as: ${client.user.tag}`);
});

// Basic command handling (replaces .menu from WhatsApp)
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const prefix = process.env.PREFIX || "!";
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        message.reply(`Pong! Latency is ${client.ws.ping}ms.`);
    }

    if (command === 'status') {
        message.reply("DreadNought V14 (Discord Edition) is running on Railway.");
    }
});

client.login(DISCORD_TOKEN);
