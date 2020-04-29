/* eslint no-undef: "error" */
/*
 * sample.test.js
 * Copyright (C) 2020 vinicius <vinicius@debian>
 *
 * Distributed under terms of the MIT license.
 */
const User = require('./models/user.js');

const currentEnv = process.env;
const jwt = require('jsonwebtoken');

process.env = { MONGODB_URI: 'mongodb://localhost:27017/livepoetryTest' };
process.env = { PORT: '5001' };
process.env = { TOKEN_KEY: 'SOME-KEY' };
