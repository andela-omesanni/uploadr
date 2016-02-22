var Sequelize = require('sequelize');
var db = require('../../config/connection');

var User = db.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING
});

module.exports = User;