const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../../models/users.js');
const saltRounds = 10;
const auth = {};

const mongoose = require('mongoose');

auth.generateToken = function(username) {
  return jwt.sign({ username: username }, process.env.TOKEN_KEY, { expiresIn: '1h' });
}

auth.proctectRoute = function(req, res, next) {
  const { username, password } = req.body;

  if (req.headers.authorization) {
    const token = (req.headers.authorization || '').replace('Bearer ','');
    jwt.verify(token, process.env.TOKEN_KEY, function(err, decoded){
      if (err) {
        res.status(401).json({err: err});
      } else {
        res.status(200).json({username: decoded.username});
      }
    });
  } else if(!username) {
    res.status(401).json({err: 'Missing token and username to auth'});
  } else {
    users.collection.createCollection();
    users.collection.findOne({username: username}).exec(function (err, user) {
      if (err) {
        res.status(401).json({err: err });
      } else {
        if(user === null) {
          bcrypt.hash(password, saltRounds).then(function(hash) {
            users.collection.create({ username: username,  password: hash });
            res.status(200).json({token: auth.generateToken(username) })
          });
        } else {
          bcrypt.compare(password, user.password).then(function(result) {
            if(result === true){
              res.status(200).json({token: auth.generateToken(user.username) })
            } else {
              res.status(401).json({err: 'Incorrect password or username' });
            }
          })
        }
      }
    })
  }

}

auth.confirmAuth = function(req, res, next) {
  const { username, password } = req.body
  res.send('OK');
}

module.exports = auth;
