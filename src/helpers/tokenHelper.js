/*
 * tokenHelper.js
 * Copyright (C) 2020 vinicius <vinicius@debian>
 *
 * Distributed under terms of the MIT license.
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const tokenHelper = {};

tokenHelper.generateToken = function (email) {
  return jwt.sign({ email }, process.env.TOKEN_KEY, { expiresIn: '24h' });
};

module.exports = tokenHelper;
