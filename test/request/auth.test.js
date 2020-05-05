/* eslint no-undef: "error" */
/*
 * sample.test.js
 * Copyright (C) 2020 vinicius <vinicius@debian>
 *
 * Distributed under terms of the MIT license.
 */
const User = require('../../models/user.js');

const currentEnv = process.env;
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const testConfig = require('../../testConfig.js');
testConfig.config();
const { email, password } = { email: 'someone@email.com', password: 'some-passs' };

describe('When to processes auth to create an user', () => {
  it('should save user to database for not existing user', async (done) => {
    const res = await testConfig.request(testConfig.app).post('/auth').send({
      email,
      password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeTruthy();
    done();
  });

  it('authenticates, but does not save and returns the token for an existing user', async (done) => {
    await bcrypt.hash(password, saltRounds).then((hash) => {
      User.collection.create({ email, password: hash });
    });

    const res = await testConfig.request(testConfig.app).post('/auth').send({
      email,
      password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeTruthy();
    done();
  });

  it('does not auth with a bad password for an existing user', async (done) => {
    const someGoodPassword = 'some-good-password';
    const someBadPassword = 'some-bad-password';
    await bcrypt.hash(password, saltRounds).then((hash) => {
      User.collection.create({ email, password: someGoodPassword });
    });

    const res = await testConfig.request(testConfig.app).post('/auth').send({
      email,
      password: someBadPassword
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.err).toBe('Incorrect password or email');
    done();
  });

  it('does not create a user with very short email, less than 6 characters', async (done) => {
    const email = 't@a.a';

    const res = await testConfig.request(testConfig.app).post('/auth').send({
      email,
      password
    });
    expect(res.statusCode).toBe(422);
    expect(res.body.err).toBe('Please fill a valid email address');
    done();
  });

  it('does not create a user with very large email, more than 60 characters', async (done) => {
    const email = 'some-large-email-larger-than-60-chars-because-life-is-that@email.com';

    const res = await testConfig.request(testConfig.app).post('/auth').send({
      email,
      password
    });
    expect(res.statusCode).toBe(422);
    expect(res.body.err).toBe('Maximum is 60 characters');
    done();
  });
});

describe('When to try to validate an token', () => {
  it('does not auth without any credentials nor the token', async (done) => {
    const res = await testConfig.request(testConfig.app).post('/auth').send({});
    expect(res.statusCode).toBe(401);
    done();
  });

  it('confirms auth if the correct token in header', async (done) => {
    const token = jwt.sign({ email: 'some-user@email.com' }, process.env.TOKEN_KEY, { expiresIn: '24h' });

    const res = await testConfig.request(testConfig.app).post('/auth').set('Authorization', `Bearer ${token}`).send({});
    expect(res.statusCode).toBe(200);
    done();
  });

  it('confirms auth if the correct token in header', async (done) => {
    const wrongKey = 'wrong-token-key';
    const token = jwt.sign({ email: 'some-user@email.com' }, wrongKey, { expiresIn: '24h' });

    const res = await testConfig.request(testConfig.app).post('/auth').set('Authorization', `Bearer ${token}`).send({});
    expect(res.statusCode).toBe(401);
    done();
  });
});
