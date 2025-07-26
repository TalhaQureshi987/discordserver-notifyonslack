// utils/slackNotifier.js
const { WebClient } = require('@slack/web-api');
require('dotenv').config();

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

// Replace with your Slack channel ID or name (e.g., 'general')
const SLACK_CHANNEL = process.env.SLACK_ALERT_CHANNEL || 'general';

const sendSlackNotification = async (message) => {
  try {
    const result = await slackClient.chat.postMessage({
      channel: SLACK_CHANNEL,
      text: message,
    });

    console.log('✅ Slack alert sent:', result.ts);
  } catch (error) {
    console.error('❌ Failed to send Slack notification:', error.message);
  }
};

module.exports = { sendSlackNotification };
