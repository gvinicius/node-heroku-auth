const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.js');
const tokenHelper = require('../helpers/tokenHelper.js');

const saltRounds = 10;
const login = {};

const mongoose = require('mongoose');

login.signup = function (req, res) {
  const { email, password } = req.body;

  User.collection.findOne({ email }).exec((err, user) => {
    if (err) {
      res.status(401).json({ err });
    }
    else if (user === null) {
      bcrypt.hash(password, saltRounds).then((hash) => {
        User.collection.create({ email, password: hash }).then((newUser) => {
          // Send email confirmation
          res.status(200).json({ token: tokenHelper.generateToken(newUser.email) });
        }).catch((err) => {
          if (err.name == 'ValidationError') {
            res.status(422).json({ err: err.errors.email.message });
          }
          else {
            res.status(500).json(err);
          }
        });
      });
    }
  });
};

login.signin = function (req, res) {
  const { email, password } = req.body;

  User.collection.findOne({ email }).exec((err, user) => {
    bcrypt.compare(password, user.password).then((result) => {
      if (result === true) {
        res.status(200).json({ token: tokenHelper.generateToken(user.email) });
      }
      else {
        res.status(401).json({ err: 'Incorrect password or email' });
      }
    });
  });
};

login.verifyUser = function (req, res) {
  const { verificationToken } = req.query;

  User.collection.findOneAndUpdate({ verificationToken }, { isValidated: true }, { upsert: false }, function(err, user) {
    if(user !== null) {
      res.status(200).json({ err: 'User verfied successfully' });
    } else {
      res.status(404).json({ err: 'User does not exist' });
    }
  }).catch((err) => {
    if (err.name == 'ValidationError') {
      res.status(404).json({ err: 'User does not exist' });
    }
    else {
      res.status(500).json(err);
    }
  });
};

module.exports = login;
