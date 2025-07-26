const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const messengerRoutes = require('./routes/messengerroute');
const emailRoutes = require('./routes/emailroute');
const slackRoutes = require('./routes/slackRoutes');
const { startSlackBot } = require('./bot/startSlackBot');
const registerMentionEvent = require('./events/mentionEvent');
const registerSlashCommand = require('./events/slashCommand');


dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // For parsing Slack x-www-form-urlencoded


// Routes
app.use('/discord', messengerRoutes);
app.use('/email', emailRoutes);
app.use('/slack', slackRoutes);

// Slack bot setup
registerMentionEvent();
startSlackBot();
registerSlashCommand(); // 👈 add this


// Routes
app.use('/slack', slackRoutes);


app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
