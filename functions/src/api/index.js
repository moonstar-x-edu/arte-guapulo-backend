const express = require('express');
const { HTTP_CODES, RESPONSES, PATH } = require('../constants');
const { db } = require('../initializers');

const app = express();

app.get('/pieces', (req, res) => {
  db.collection(PATH.PIECES).get()
    .then((snapshot) => {
      const data = snapshot.docs.map((doc) => {
        return doc.data();
      });
      res.status(HTTP_CODES.OK).send(data);
    })
    .catch((error) => {
      res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(RESPONSES.INTERNAL_SERVER_ERROR(error));
    });
});

app.get('*', (_, res) => {
  res.status(HTTP_CODES.NOT_FOUND).send(RESPONSES.NOT_FOUND);
});

module.exports = app;
