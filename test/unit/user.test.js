/*
 * user_test.js
 * Copyright (C) 2020 vinicius <vinicius@debian>
 *
 * Distributed under terms of the MIT license.
 */
const bcrypt = require('bcrypt');
const User = require('../../models/user.js');
const testConfig = require('../../testConfig.js');

const saltRounds = 10;
testConfig.config();

describe('When to create an user', () => {
  it('creates normally with the correct params', async (done) => {
    const password = 'some-pass';
    const username = 'some-user';
    let user = null;

    await bcrypt.hash(password, saltRounds).then((hash) => {
      User.collection.create({ username, password: hash }).then((newUser) => {
        user = newUser;
        expect(user.id).toBeTruthy();
        done();
      });
    });
  });
});
