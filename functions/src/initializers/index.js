require('dotenv').config();
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Can't find a better way to have this work both locally and when deploying.

// if (process.env.LOCAL_SERVE) {
//   const serviceAccount = require('../../../serviceAccount.json');
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: process.env.FIRESTORE_URL
//   });
// } else {
//   admin.initializeApp(functions.config().firebase);
// }

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

module.exports = {
  admin,
  db
};
