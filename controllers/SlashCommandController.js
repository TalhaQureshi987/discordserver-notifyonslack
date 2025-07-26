// controllers/slashCommands.js
const helpbotCommand = async (req, res) => {
  const { user_name } = req.body;

  const helpMessage = `
  💡 *Hi @${user_name}!* Here are some things I can do:
  • Mention me — I’ll reply 👋
  • Type "issue" — I’ll help you log a support ticket
  • More features coming soon!
  `;

  return res.status(200).send(helpMessage);
};

module.exports = { helpbotCommand };
