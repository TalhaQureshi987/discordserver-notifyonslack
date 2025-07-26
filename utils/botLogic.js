function generateReply(text) {
    if (text.includes('hello')) return "Hi there! 👋";
    if (text.includes('help')) return "How can I assist you today?";
    return "I'm your helpful Slack bot! 🤖";
  }
  
  module.exports = { generateReply };
  