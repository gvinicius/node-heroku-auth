const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.js');
const tokenHelper = require('../helpers/tokenHelper.js');
const _ = require('lodash');

const saltRounds = 10;
const users = {};

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

users.update = function (req, res) {
  const id = new ObjectId(req.params.id);
  // by now, only data field could be updated
  const params = _.pick(req.body, 'data');

  User.collection.findOneAndUpdate({ _id: id }, params, { upsert: false }).then((user) => {
    if(user !== null) {
      res.status(200).json({ result: 'User updated' });
    } else {
      res.status(404).json({ err: 'User does not exist' });
    }
  }).catch((err) => {
    if (err.name == 'ValidationError') {
      res.status(422).json({ err: 'Error in attribute' });
    }
    else {
      res.status(500).json(err);
    }
  });
};

users.isAvailable = function (req, res) {
  const { email } = req.query;

  User.collection.findOne({ email }, function(err, user) {
    console.log(user)
    if(user !== null) {
      res.status(200).json({ isAvailable: 'false' });
    } else {
      res.status(200).json({ isAvailable: 'true' });
    }
  }).catch((err) => {
      res.status(500).json(err);
  });
};

users.show = function (req, res) {
  const id = new ObjectId(req.params.id);

  User.collection.findOne({ _id: id }, function(err, user) {
    console.log(user)
    if(user !== null) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ user: null });
    }
  }).catch((err) => {
      res.status(500).json(err);
  });
};

users.resetPassword = function (req, res) {
  const { password, passwordResetToken } = req.body;

  bcrypt.hash(password, saltRounds).then((hash) => {
    const params = { password: hash, passwordResetToken: null };
    User.collection.findOneAndUpdate({ passwordResetToken }, params, { upsert: false }, function(err, user) {
      if(user !== null) {
        res.status(200).json({ result: 'The new password has been set!' });
      } else {
        res.status(404).json({ err: 'User does not exist' });
      }
    }).catch((err) => {
      if (err.name == 'ValidationError') {
        res.status(422).json({ err: 'Error in attribute' });
      }
      else {
        res.status(500).json(err);
      }
    });
  });
};

module.exports = users;
