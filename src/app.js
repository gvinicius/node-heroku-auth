const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');

const auth = require('./controllers/authController.js');

app.use(compression());
app.use(bodyParser.json());

app.post('/auth', async (req, res, next) => auth.proctectRoute(req, res, next));

app.post('/confirm', async (req, res, next) => auth.confirmAuth(req, res, next));

module.exports = app;
