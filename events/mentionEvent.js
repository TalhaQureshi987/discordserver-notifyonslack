const slackApp = require('../config/slack');

const registerMentionEvent = () => {
  slackApp.event('app_mention', async ({ event, say }) => {
    try {
      await say(`👋 Hi <@${event.user}>, how can I assist you?`);
    } catch (error) {
      console.error('Error handling mention:', error);
    }
  });
};

module.exports = registerMentionEvent;
