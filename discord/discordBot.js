const { Client, GatewayIntentBits, Partials, PermissionsBitField } = require('discord.js');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const { sendSlackNotification } = require('../utils/slackNotifier'); // Slack notify util
const Redis = require('ioredis');
const WebSocket = require('ws');

dotenv.config();

// PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Redis
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// WebSocket (optional use)
const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', (ws) => {
  console.log('🔌 WebSocket client connected');
});

// Discord client setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

// Ready
client.once('ready', () => {
  console.log(`🤖 Discord bot logged in as ${client.user.tag}`);
});

// Message listener
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const { content, author, channel } = message;

  // Save to PostgreSQL
  try {
    await pool.query(
      'INSERT INTO messages (channel, sender, recipient, content) VALUES ($1, $2, $3, $4)',
      ['discord', author.id, channel.id, content]
    );
    console.log("✅ Message saved to DB");
  } catch (err) {
    console.error('❌ DB Save Error:', err.message);
  }

  // Notify Slack
  try {
    await sendSlackNotification(`🆕 **${author.username}** posted in Discord:\n> ${content}`);
    console.log('✅ Slack notified');
  } catch (err) {
    console.error('❌ Slack Error:', err.message);
  }

  // Publish to Redis (optional real-time usage)
  redis.publish('new_discord_message', JSON.stringify({
    user: author.username,
    content,
    timestamp: new Date().toISOString()
  }));

  // WebSocket broadcast (optional)
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'discord_message',
        user: author.username,
        content,
      }));
    }
  });
});

// Function: Send to Discord channel
const sendMessageToChannel = async (channelId, text) => {
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) throw new Error("Channel not found");

    const botPermissions = channel.permissionsFor(client.user);
    if (!botPermissions?.has(PermissionsBitField.Flags.SendMessages)) {
      throw new Error("Missing permission to send messages.");
    }

    const sentMessage = await channel.send(text);
    await sendSlackNotification(`📤 Bot posted to Discord channel:\n> ${text}`);

    return { status: 'success', messageId: sentMessage.id };
  } catch (err) {
    console.error('❌ Send Error:', err.message);
    return { status: 'error', error: err.message };
  }
};

client.login(process.env.DISCORD_BOT_TOKEN);

module.exports = { sendMessageToChannel };
