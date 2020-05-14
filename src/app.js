const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');

const auth = require('./controllers/authController.js');
const login = require('./controllers/loginController.js');
const users = require('./controllers/usersController.js');

app.use(compression());
app.use(bodyParser.json());

app.post('/auth', async (req, res, next) => auth.proctectRoute(req, res, next));
app.post('/signup', async (req, res) => login.signup(req, res));
app.post('/signin', async (req, res) => login.signin(req, res));
app.get('/verify_user', async (req, res, next) => login.verifyUser(req, res));
app.put('/user/:id', async (req, res, next) => auth.proctectRoute(req, res, next));
app.put('/user/:id', async (req, res) => users.update(req, res));
app.get('/user/is_available', async (req, res) => users.isAvailable(req, res));

module.exports = app;
