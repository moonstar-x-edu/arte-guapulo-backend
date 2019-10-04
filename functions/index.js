const functions = require('firebase-functions');
const express = require('express');
const piece = require('./src/api');

const main = express();
main.use('/piece/', piece);

exports.api = functions.https.onRequest(main);
