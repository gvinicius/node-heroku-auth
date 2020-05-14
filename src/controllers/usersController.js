const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.js');
const tokenHelper = require('../helpers/tokenHelper.js');

const saltRounds = 10;
const users = {};

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

users.update = function (req, res) {
  const id = new ObjectId(req.params.id);
  const params = req.body;

  User.collection.findOneAndUpdate({ _id: id }, params, { upsert: false }, function(err, user) {
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

module.exports = users;
