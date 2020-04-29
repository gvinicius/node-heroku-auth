/*
 * sample.test.js
 * Copyright (C) 2020 vinicius <vinicius@debian>
 *
 * Distributed under terms of the MIT license.
 */
const users = require('./models/users.js');
const currentEnv = process.env
const jwt = require('jsonwebtoken');

process.env = { MONGODB_URI: "mongodb://localhost:27017/livepoetryTest" };
process.env = { PORT: "5001" };
process.env = { TOKEN_KEY: "SOME-KEY" };
const bcrypt = require('bcrypt');
const saltRounds = 10;

const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/livepoetryTest", { useNewUrlParser: true });
});

const request = require('supertest')
const express = require('./src/app.js');

const { username, password } = {username: "someone", password: "some-pass"};

describe('When to processes auth',  () => {
  it("should save user to database for not existing user", async done => {
    const res = await request(express).post("/auth").send({
      username: username,
      password: password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeTruthy();
    done();
  });

  it("does not save and returns the token for an existing user", async done => {
    await bcrypt.hash(password, saltRounds).then(function(hash) {
      users.collection.create({ username: username,  password: hash });
    });

    const res = await request(express).post("/auth").send({
      username: username,
      password: password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeTruthy();
    done();
  });

  it("does not auth with a bad password for an existing user", async done => {
    const someGoodPassword = 'some-good-password'
    const someBadPassword = 'some-bad-password'
    await bcrypt.hash(password, saltRounds).then(function(hash) {
      users.collection.create({ username: username,  password: someGoodPassword });
    });

    const res = await request(express).post("/auth").send({
      username: username,
      password: someBadPassword
    });
    expect(res.statusCode).toBe(401);
    expect(res.body.err).toBe('Incorrect password or username');
    done();
  });

  it("does not auth without any credentials nor the token", async done => {
    const res = await request(express).post("/auth").send({});
    expect(res.statusCode).toBe(401);
    done();
  });

  it("confirms auth if the correct token in header", async done => {

    const token = jwt.sign({ username: 'some-user' }, process.env.TOKEN_KEY, { expiresIn: '1h' })

    const res = await request(express).post("/auth").set('Authorization', "Bearer " + token).send({});
    expect(res.statusCode).toBe(200);
    done();
  });

  it("confirms auth if the correct token in header", async done => {

    const token = jwt.sign({ username: 'some-user' }, 'wrong-token-key', { expiresIn: '1h' })

    const res = await request(express).post("/auth").set('Authorization', "Bearer " + token).send({});
    expect(res.statusCode).toBe(401);
    done();
  });
})

afterEach(async () => {
  await users.collection.remove({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
