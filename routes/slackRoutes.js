const express = require('express');
const router = express.Router();
const { sendMessageToChannel } = require('../controllers/slackController');

router.post('/send-message', sendMessageToChannel);

router.get('/', (req, res) => {
  res.send('Slack bot route is live!');
});

module.exports = router;
