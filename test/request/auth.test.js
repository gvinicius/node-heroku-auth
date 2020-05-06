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

describe('When to try to validate an token', () => {
  it('does not auth without any credentials nor the token', async (done) => {
    const res = await testConfig.request(testConfig.app).post('/auth').send({});
    expect(res.statusCode).toBe(401);
    done();
  });

  it('confirms auth if the correct token in header', async (done) => {
    const wrongKey = 'wrong-token-key';
    const token = jwt.sign({ email: 'some-user@email.com' }, wrongKey, { expiresIn: '24h' });

    const res = await testConfig.request(testConfig.app).post('/auth').set('Authorization', `Bearer ${token}`).send({});
    expect(res.statusCode).toBe(401);
    done();
  });

  it('confirms auth if the correct token in header', async (done) => {
    const token = jwt.sign({ email: 'some-user@email.com' }, process.env.TOKEN_KEY, { expiresIn: '24h' });

    const res = await testConfig.request(testConfig.app).post('/auth').set('Authorization', `Bearer ${token}`).send({});
    expect(res.statusCode).toBe(200);
    done();
  });
});
