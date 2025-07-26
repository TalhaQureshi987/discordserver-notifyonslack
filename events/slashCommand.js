const axios = require('axios');
const slackApp = require('../config/slack');

const registerSlashCommand = () => {
  slackApp.command('/helpbot', async ({ command, ack, say }) => {
    await ack();

    const userQuestion = command.text.trim();

    if (!userQuestion) {
      return await say(
        '❓ You can ask things like:\n• `how to deploy?`\n• `status`\n• `contact info`\nOr ask anything else!'
      );
    }

    try {
      const response = await axios.post(
        'https://chat.pawan.krd/api/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant for IT support.' },
            { role: 'user', content: userQuestion }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const reply = response.data.choices[0].message.content;
      await say(reply);
    } catch (error) {
      console.error('GPT API Error:', error.response?.data || error.message);
      await say('⚠️ GPT is currently unavailable. Try again later.');
    }
  });
};

module.exports = registerSlashCommand;
