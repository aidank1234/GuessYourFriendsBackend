const dbConfig = require("../db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.mongoose.set('useCreateIndex', true);
db.mongoose.set('useFindAndModify', false);
db.url = dbConfig.url;

db.game = require('./game.model.js')(mongoose);
db.question = require('./question.model')(mongoose);
db.questionSet = require('./questionSet.model')(mongoose);

module.exports = db;
