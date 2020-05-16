/* eslint no-undef: "error" */
/*
 * sample.test.js
 * Copyright (C) 2020 vinicius <vinicius@debian>
 *
 * Distributed under terms of the MIT license.
 */
const currentEnv = process.env;
const testConfig = {};
const mongoose = require('mongoose');
const User = require('./models/user.js');

testConfig.db = require('./db/db.js');

testConfig.request = require('supertest');
testConfig.app = require('./src/app.js');

process.env = { TOKEN_KEY: 'SOME-KEY' };

testConfig.config = function () {
  beforeAll(async () => {
    require('dotenv').config();
    testConfig.db.start();
  });

  afterEach(async () => {
    await User.collection.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
};

module.exports = testConfig;
