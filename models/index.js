const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const user = require("./user");
const feed = require("./feed");

const env = process.env.NODE_ENV || "dev";
const config = require("../config/config")[env];

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.User = user;
db.Feed = feed;

Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
