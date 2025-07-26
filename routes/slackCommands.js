// routes/slackCommands.js
const express = require('express');
const router = express.Router();
const { handleHelpbotCommand } = require('../controllers/SlashCommandController');

router.post('/slack/commands', handleHelpbotCommand);

module.exports = router;
