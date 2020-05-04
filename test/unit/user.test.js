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
const password = 'some-pass';
const username = 'some-user';

describe('When to create an user', () => {
  it('creates normally with the correct params', async (done) => {
    await bcrypt.hash(password, saltRounds).then((hash) => {
      User.collection.create({ username, password: hash }).then((newUser) => {
        expect(newUser.id).toBeTruthy();
        done();
      });
    });
  });

  it('does not create a user without username', async (done) => {
    const username = '';

    await bcrypt.hash(password, saltRounds).then((hash) => {
      User.collection.create({ username, password: hash }).then((newUser) => {null}).catch((err) => {
        expect(err.errors.username.message).toBe("Path `username` is required.");
        done();
      });
    });
  });

  it('does not create a user with a too small username', async (done) => {
    const username = 'tiny';

    await bcrypt.hash(password, saltRounds).then((hash) => {
      User.collection.create({ username, password: hash }).then((newUser) => {null}).catch((err) => {
        expect(err.errors.username.message).toBe('Minimum is 6 characters');
        done();
      });
    });
  });

  it('does not create a user with a too long username', async (done) => {
    const username = 'some-large-username-larger-than-60-chars-because-life-is-that';

    await bcrypt.hash(password, saltRounds).then((hash) => {
      User.collection.create({ username, password: hash }).then((newUser) => {null}).catch((err) => {
        expect(err.errors.username.message).toBe('Maximum is 60 characters');
        done();
      });
    });
  });

  it('does not create a user with a duplicate username', async (done) => {
    await bcrypt.hash(password, saltRounds).then((hash) => {
      User.collection.create({ username, password: hash }).then((newUser) => { });
      User.collection.create({ username, password: hash }).then((newUser) => {null}).catch((err) => {
        console.log(err)
        expect(err.toString()).toBe('MongoError: E11000 duplicate key error collection: livepoetry.collections index: username_1 dup key: { : "some-user" }');
        done();
      });
    });
  });

  it('does not create a user without password', async (done) => {
    const username = 'some-user';

    User.collection.create({ username, password: null }).then((newUser) => {null}).catch((err) => {
      expect(err.errors.password.message).toBe("Path `password` is required.");
      done();
    });
  });
});
