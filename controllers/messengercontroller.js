const Message = require('../model/messagemodel');
const { sendMessageToChannel, checkChannelPermission } = require('../discord/discordBot');

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({ order: [['createdAt', 'DESC']] });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch messages' });
  }
};

exports.sendToDiscordChannel = async (req, res) => {
  const { channelId, message } = req.body;

  if (!channelId || !message) {
    return res.status(400).json({ error: 'channelId and message are required' });
  }

  try {
    // Check if bot has permission to send message to the channel
    const hasPermission = await checkChannelPermission(channelId);
    if (!hasPermission) {
      return res.status(403).json({ error: 'Bot lacks permission to send messages to this channel.' });
    }

    // Send message to Discord
    await sendMessageToChannel(channelId, message);

    // Save the message in PostgreSQL
    const savedMessage = await Message.create({
      channel: 'discord',
      sender: 'api', // Since it's from Postman or server
      recipient: channelId,
      content: message
    });

    console.log(`📢 Notification: Message sent to ${channelId} and saved in DB.`);

    res.json({
      success: true,
      message: 'Message sent and saved',
      data: savedMessage
    });
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to send message', details: error.message });
  }
};
