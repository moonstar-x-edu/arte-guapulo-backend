const functions = require('firebase-functions');
const express = require('express');
const app = require('./src/api');

const main = express();
main.use('/', app);

exports.api = functions.https.onRequest(main);
