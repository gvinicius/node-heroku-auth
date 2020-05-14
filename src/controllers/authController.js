const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.js');

const saltRounds = 10;
const auth = {};

const mongoose = require('mongoose');

auth.proctectRoute = function (req, res, next) {
  if (req.headers.authorization) {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
      if (err) {
        res.status(401).json({ err });
      }
      else {
        next();
      }
    });
  }
  else {
    res.status(401).json({ err: 'Missing token'});
  }
};

module.exports = auth;
