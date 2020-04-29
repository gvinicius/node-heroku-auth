const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.js');

const saltRounds = 10;
const auth = {};

const mongoose = require('mongoose');

auth.generateToken = function (username) {
  return jwt.sign({ username }, process.env.TOKEN_KEY, { expiresIn: '1h' });
};

auth.proctectRoute = function (req, res, next) {
  const { username, password } = req.body;

  if (req.headers.authorization) {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({ err });
      }
      else {
        res.status(200).json({ username: decoded.username });
      }
    });
  }
  else if (!username || !password) {
    res.status(401).json({ err: 'Missing token, username and passowrd for auth' });
  }
  else {
    User.collection.createCollection();
    User.collection.findOne({ username }).exec((err, user) => {
      if (err) {
        res.status(401).json({ err });
      }
      else if (user === null) {
        bcrypt.hash(password, saltRounds).then((hash) => {
          User.collection.create({ username, password: hash }).then((newUser) => {
            console.log('ok');
            res.status(200).json({ token: auth.generateToken(newUser.username) });
          }).catch((err) => {
            if (err.name == 'ValidationError') {
              res.status(422).json({ err: err.errors.username.message });
            }
            else {
              res.status(500).json(err);
            }
          });
        });
      }
      else {
        bcrypt.compare(password, user.password).then((result) => {
          if (result === true) {
            res.status(200).json({ token: auth.generateToken(user.username) });
          }
          else {
            res.status(401).json({ err: 'Incorrect password or username' });
          }
        });
      }
    });
  }
};

auth.confirmAuth = function (req, res, next) {
  const { username, password } = req.body;
  res.send('OK');
};

module.exports = auth;
