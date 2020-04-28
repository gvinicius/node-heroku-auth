/*
 * sample.test.js
 * Copyright (C) 2020 vinicius <vinicius@debian>
 *
 * Distributed under terms of the MIT license.
 */
const currentEnv = process.envç
process.env = { MONGODB_URI: "mongodb://localhost:27017/livepoetryTest" };
process.env = { PORT: "5001" };
process.env = { TOKEN_KEY: "SOME-KEY" };

const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/livepoetryTest", { useNewUrlParser: true });
});

const request = require('supertest')
const express = require('./index.js')
describe('Post Endpoints',  () => {
  it("Should save user to database", async done => {
    const res = await request(express).post("/auth").send({
      username: "someone",
      password: "some-pass"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeTruthy();
    done();
  });
})

afterAll(() => {
  mongoose.connection.dropDatabase();
});
