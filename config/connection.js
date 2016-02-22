var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost/', {
  pool: { max: 5, min: 5 }
});

module.exports = db;