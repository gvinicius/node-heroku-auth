const mongoose = require('mongoose');

const User = {};

User.schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: [6, 'Minimum is 6 characters'],
      maxlength: [60, 'Maximum is 60 characters'],
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Minimum is 6 characters'],
      maxlength: [60, 'Maximum is 60 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  }
);

User.collection = mongoose.model('collection', User.schema);

module.exports = User;
