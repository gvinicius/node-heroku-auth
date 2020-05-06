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
const email = 'someuser@somemail.com';

describe('When to create an user', () => {
  it('creates normally with the correct params', async (done) => {
    await bcrypt.hash(password, saltRounds).then((hash) => {
      User.collection.create({ email, password: hash }).then((newUser) => {
        expect(newUser.id).toBeTruthy();
        done();
      });
    });
  });

  it('does not create a user without email', async (done) => {
    const email = '';

    await bcrypt.hash(password, saltRounds).then((hash) => {
      User.collection.create({ email, password: hash }).then((newUser) => {null}).catch((err) => {
        expect(err.errors.email.message).toBe("Path `email` is required.");
        done();
      });
    });
  });

  it('does not create a user with email in not valid format', async (done) => {
    const email = 't@a.a';

    await bcrypt.hash(password, saltRounds).then((hash) => {
      User.collection.create({ email, password: hash }).then((newUser) => {null}).catch((err) => {
        expect(err.errors.email.message).toBe('Please fill a valid email address');
        done();
      });
    });
  });

  it('does not create a user with a too long email', async (done) => {
    const email = 'some-large-email-larger-than-60-chars-because-life-is-that@email.com';

    await bcrypt.hash(password, saltRounds).then((hash) => {
      User.collection.create({ email, password: hash }).then((newUser) => {null}).catch((err) => {
        expect(err.errors.email.message).toBe('Maximum is 60 characters');
        done();
      });
    });
  });

  it('does not create a user with a duplicate email', async (done) => {
    await bcrypt.hash(password, saltRounds).then((hash) => {
      User.collection.create({ email, password: hash }).then((newUser) => { });
      User.collection.create({ email, password: hash }).then((newUser) => {null}).catch((err) => {
        expect(err.toString()).toBe('MongoError: E11000 duplicate key error collection: livepoetry.collections index: email_1 dup key: { : "someuser@somemail.com" }');
        done();
      });
    });
  });

  it('does not create a user without password', async (done) => {
    const email = 'some-user';

    User.collection.create({ email, password: null }).then((newUser) => {null}).catch((err) => {
      expect(err.errors.password.message).toBe("Path `password` is required.");
      done();
    });
  });
});
