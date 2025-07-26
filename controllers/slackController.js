const slackApp = require('../config/slack');
const { WebClient } = require('@slack/web-api');

const web = new WebClient(process.env.SLACK_BOT_TOKEN);

// Handle @mention
const registerMentionEvent = () => {
  slackApp.event('app_mention', async ({ event, say }) => {
    try {
      await say(`👋 Hi <@${event.user}>, how can I assist you?`);
    } catch (error) {
      console.error('Error handling mention:', error);
    }
  });
};

// Send message to a channel using channel name
const sendMessageToChannel = async (req, res) => {
  const { channelName, text } = req.body;

  try {
    // Get list of conversations to find channel ID
    const result = await web.conversations.list();
    const channel = result.channels.find(c => c.name === channelName);

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // Send message
    await web.chat.postMessage({
      channel: channel.id,
      text,
    });

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

module.exports = {
  registerMentionEvent,
  sendMessageToChannel,
};
