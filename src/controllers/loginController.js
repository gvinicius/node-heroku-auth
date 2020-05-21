const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.js');
const emailSender = require('../../services/emailSender.js');
const tokenHelper = require('../helpers/tokenHelper.js');
const { v4: uuidv4 } = require('uuid');

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
          if(process.env.NODE_ENV === 'production') {
            emailSender.run('Confirm your account', 'Copy link and access the link on your browser to validate your user: ' + APP_HOSTNAME + '/verify_user?verificationToken=' +  newUser.verificationToken, newUser.email);
          }
          res.status(200).json({ token: tokenHelper.generateToken(newUser.email), id: newUser._id });
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
        res.status(200).json({ token: tokenHelper.generateToken(user.email), id: user._id });
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
      res.status(500).json(err);
  });
};

login.recoveryMailPassword = function (req, res) {
  const { id } = req.query;
  const resetToken = uuidv4();

  User.collection.findOneAndUpdate({ _id: id }, { passwordResetToken: resetToken }, { upsert: false }).then((user) => {
    if(user !== null) {
      if(process.env.NODE_ENV === 'production') {
        emailSender.run('Reset password code', 'Your reset code is : ' + user.resetToken, user.email);
      }
      res.status(200).json({ result: 'Reset password email has been sent' });
    } else {
      res.status(404).json({ err: 'User does not exist' });
    }
  }).catch((err) => {
    res.status(500).json(err);
  });
};

module.exports = login;
