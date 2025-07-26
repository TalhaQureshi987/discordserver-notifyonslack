const slackApp = require('../config/slack');

const startSlackBot = async () => {
  try {
    await slackApp.start();
    console.log('⚡️ Slack bot is running!');
  } catch (error) {
    console.error('Error starting Slack bot:', error);
  }
};

module.exports = { startSlackBot };
