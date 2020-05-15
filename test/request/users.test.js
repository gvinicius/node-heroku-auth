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
const ObjectId = mongoose.Types.ObjectId;

const bcrypt = require('bcrypt');

const saltRounds = 10;

const testConfig = require('../../testConfig.js');
testConfig.config();

this.user = null;
const { email, password } = { email: 'someone@email.com', password: 'some-passs' };
const id = new ObjectId(1);

const wrongId = new ObjectId(2);
const verificationToken = 'f62e0909-bc8f-4721-902d-257f15d57fc8';
const token = jwt.sign({ email: 'some-user@email.com' }, process.env.TOKEN_KEY, { expiresIn: '24h' });

beforeEach(
  async () => {
    await bcrypt.hash(password, saltRounds).then((hash) => {
      User.collection.create({ email, password: hash, verificationToken, _id: id, passwordResetToken: 'f62e0909-bc8f-4721-902d-257f15d57fc8'}).then( (user) =>this.user = user );
    });
  });

describe('When to process user update', () => {
  const params = { data: 'some-data' }

  it('does not update params for the targeted user without token', async (done) => {
    const res = await testConfig.request(testConfig.app).put('/user/' + id).send(params);
    expect(res.statusCode).toBe(401);
    expect(res.body).toBeTruthy();
    done();
  });

  it('does not update params for the targeted user with invalid params', async (done) => {
    const params = { email: null }

    const res = await testConfig.request(testConfig.app).put('/user/' + id).set('Authorization', `Bearer ${token}`).send(params);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
    done();
  });

  it('updates params for the targeted user', async (done) => {

    const res = await testConfig.request(testConfig.app).put('/user/' + id).set('Authorization', `Bearer ${token}`).send({params});

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeTruthy();
    done();
  });

});

describe('When to process email availabity checking', () => {
  const otherEmail = 'someuser@otheremail.com';

  it('returns true for a non-existing email', async (done) => {

    const res = await testConfig.request(testConfig.app).get('/user/is_available?email=' + otherEmail);

    expect(res.statusCode).toBe(200);
    expect(res.body.isAvailable).toBe('true');
    done();
  });

  it('returns false for a non-existing email', async (done) => {

    const res = await testConfig.request(testConfig.app).get('/user/is_available?email=' + this.user.email);

    expect(res.statusCode).toBe(200);
    expect(res.body.isAvailable).toBe('false');
    done();
  });
});

describe('When to process user to show', () => {
  it('returns the user', async (done) => {
    const res = await testConfig.request(testConfig.app).get('/user/' + id).set('Authorization', `Bearer ${token}`).send();

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(this.user.email);
    done();
  });

  it('does not return the user', async (done) => {
    const res = await testConfig.request(testConfig.app).get('/user/' + wrongId).set('Authorization', `Bearer ${token}`).send();

    expect(res.statusCode).toBe(404);
    expect(res.body.user).toBe(null);
    done();
  });
});

describe('When to process reset password', () => {
  it('returns success', async (done) => {
    const params = { passwordResetToken: 'f62e0909-bc8f-4721-902d-257f15d57fc8', password: 'new-pass' };

    const res = await testConfig.request(testConfig.app).put('/users/reset_password').send(params);
    expect(res.statusCode).toBe(200);
    done();
  });
});
