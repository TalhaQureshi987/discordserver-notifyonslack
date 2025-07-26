const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  slackId: DataTypes.STRING,
  name: DataTypes.STRING,
});

module.exports = User;
