const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.js');

const saltRounds = 10;
const auth = {};

const mongoose = require('mongoose');

auth.generateToken = function (email) {
  return jwt.sign({ email }, process.env.TOKEN_KEY, { expiresIn: '24h' });
};

auth.proctectRoute = function (req, res, next) {
  const { email, password } = req.body;

  if (req.headers.authorization) {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({ err });
      }
      else {
        res.status(200).json({ email: decoded.email });
      }
    });
  }
  else if (!email || !password) {
    res.status(401).json({ err: 'Missing token, email and passowrd for auth' });
  }
  else {
    User.collection.createCollection();
    User.collection.findOne({ email }).exec((err, user) => {
      if (err) {
        res.status(401).json({ err });
      }
      else if (user === null) {
        bcrypt.hash(password, saltRounds).then((hash) => {
          User.collection.create({ email, password: hash }).then((newUser) => {
            res.status(200).json({ token: auth.generateToken(newUser.email) });
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
      else {
        bcrypt.compare(password, user.password).then((result) => {
          if (result === true) {
            res.status(200).json({ token: auth.generateToken(user.email) });
          }
          else {
            res.status(401).json({ err: 'Incorrect password or email' });
          }
        });
      }
    });
  }
};

auth.confirmAuth = function (req, res, next) {
  const { email, password } = req.body;
  res.send('OK');
};

module.exports = auth;
