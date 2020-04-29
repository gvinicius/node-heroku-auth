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
const bcrypt = require('bcrypt');

const saltRounds = 10;

const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/livepoetryTest', { useNewUrlParser: true });
});

const request = require('supertest');
const app = require('./src/app.js');

const { username, password } = { username: 'someone', password: 'some-pass' };

describe('When to processes auth to create an user', () => {
  it('should save user to database for not existing user', async (done) => {
    const res = await request(app).post('/auth').send({
      username,
      password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeTruthy();
    done();
  });

  it('authenticates, but does not save and returns the token for an existing user', async (done) => {
    await bcrypt.hash(password, saltRounds).then((hash) => {
      User.collection.create({ username, password: hash });
    });

    const res = await request(app).post('/auth').send({
      username,
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
      User.collection.create({ username, password: someGoodPassword });
    });

    const res = await request(app).post('/auth').send({
      username,
      password: someBadPassword
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.err).toBe('Incorrect password or username');
    done();
  });

  it('does not create a user with very short username, less than 6 characters', async (done) => {
    const username = 'tiny';

    const res = await request(app).post('/auth').send({
      username,
      password
    });
    expect(res.statusCode).toBe(422);
    expect(res.body.err).toBe('Minimum is 6 characters');
    done();
  });

  it('does not create a user with very large username, more than 60 characters', async (done) => {
    const username = 'some-large-username-larger-than-60-chars-because-life-is-that';

    const res = await request(app).post('/auth').send({
      username,
      password
    });
    expect(res.statusCode).toBe(422);
    expect(res.body.err).toBe('Maximum is 60 characters');
    done();
  });
});

describe('When to try to validate an token', () => {
  it('does not auth without any credentials nor the token', async (done) => {
    const res = await request(app).post('/auth').send({});
    expect(res.statusCode).toBe(401);
    done();
  });

  it('confirms auth if the correct token in header', async (done) => {
    const token = jwt.sign({ username: 'some-user' }, process.env.TOKEN_KEY, { expiresIn: '1h' });

    const res = await request(app).post('/auth').set('Authorization', `Bearer ${token}`).send({});
    expect(res.statusCode).toBe(200);
    done();
  });

  it('confirms auth if the correct token in header', async (done) => {
    const wrongKey = 'wrong-token-key';
    const token = jwt.sign({ username: 'some-user' }, wrongKey, { expiresIn: '1h' });

    const res = await request(app).post('/auth').set('Authorization', `Bearer ${token}`).send({});
    expect(res.statusCode).toBe(401);
    done();
  });
});

afterEach(async () => {
  await User.collection.remove({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
