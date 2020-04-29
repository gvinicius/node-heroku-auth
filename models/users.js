const mongoose = require('mongoose');
const users = {};
users.schema = new mongoose.Schema({ username: String, password: String });
users.collection = mongoose.model('collection', users.schema);

module.exports = users;
