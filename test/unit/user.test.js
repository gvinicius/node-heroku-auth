/*
 * user_test.js
 * Copyright (C) 2020 vinicius <vinicius@debian>
 *
 * Distributed under terms of the MIT license.
 */
const User = require('../../models/user.js');

process.env = { MONGODB_URI: 'mongodb://localhost:27017/livepoetryTest' };
process.env = { PORT: '5001' };
process.env = { TOKEN_KEY: 'SOME-KEY' };
const bcrypt = require('bcrypt');

const saltRounds = 10;

const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/livepoetryTest', { useNewUrlParser: true });
});

const request = require('supertest');
const app = require('../../src/app.js');

describe('When to processes auth to create an user', () => {
  it('authenticates, but does not save and returns the token for an existing user', async (done) => {
    const password = 'some-pass';
    const username = 'some-user';
    await bcrypt.hash(password, saltRounds).then((hash) => {
      const user = User.collection.create({ username, password: hash });
      expect(user).toBeTruthy();
      done();
    });
  });
});
