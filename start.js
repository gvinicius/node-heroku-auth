/*
 * start.js
 * Copyright (C) 2020 vinicius <vinicius@debian>
 *
 * Distributed under terms of the MIT license.
 */
const app = require('./index.js');
const PORT = process.env.PORT || 5000;

app.listen(PORT);
