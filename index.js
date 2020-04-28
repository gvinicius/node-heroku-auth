const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const auth = require('./auth.js')
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/livepoetry", { useNewUrlParser: true });

app.use(bodyParser.json());

app.post('/auth', async (req, res, next) => auth.proctectRoute(req, res, next));

app.post('/confirm', async (req, res, next) => auth.confirmAuth(req, res, next))

module.exports = app;
