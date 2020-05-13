const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');

const auth = require('./controllers/authController.js');
const login = require('./controllers/loginController.js');

app.use(compression());
app.use(bodyParser.json());

app.post('/auth', async (req, res, next) => auth.proctectRoute(req, res, next));
app.post('/signup', async (req, res, next) => login.signup(req, res));
app.post('/signin', async (req, res, next) => login.signin(req, res));
app.get('/verify_user', async (req, res, next) => login.verifyUser(req, res));

module.exports = app;
