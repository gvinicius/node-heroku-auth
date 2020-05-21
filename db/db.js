/*
 * db.js
 * Copyright (C) 2020 vinicius <vinicius@debian>
 *
 * Distributed under terms of the MIT license.
 */
const mongoose = require('mongoose');

const db = {};

db.connection = () => {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/livepoetry', {
    useNewUrlParser: true
  })
}

db.start = async () => {
  try {
    await db.connection();
  }
  catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = db;
