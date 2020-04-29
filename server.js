/*
 * start.js
 * Copyright (C) 2020 vinicius <vinicius@debian>
 *
 * Distributed under terms of the MIT license.
 */
const app = require('./src/app.js');
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0");
