const express = require('express');
const router = express.Router();
const {
  getAllMessages,
  sendToDiscordChannel
} = require('../controllers/messengercontroller');

// Fetch all saved messages
router.get('/', getAllMessages);

// Send message to Discord channel
router.post('/send', async (req, res, next) => {
  try {
    // Forward request to controller
    await sendToDiscordChannel(req, res);
  } catch (err) {
    console.error("❌ Error in /send route:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
