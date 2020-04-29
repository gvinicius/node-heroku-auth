const mongoose = require('mongoose');

const User = {};

User.schema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: [6, 'Minimum is 6 characters'],
      maxlength: [60, 'Maximum is 60 characters'],
      required: true,
      unique: true
    },
    password: {
      type: String,
      minlength: [6, 'Minimum is 6 characters'],
      maxlength: [60, 'Maximum is 60 characters'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  }
);

User.collection = mongoose.model('collection', User.schema);

module.exports = User;
