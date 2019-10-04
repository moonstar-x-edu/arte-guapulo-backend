const express = require('express');
const bodyParser = require('body-parser');
const { HTTP_CODES, RESPONSES, PATH } = require('../constants');
const { db } = require('../initializers');
const pieceSchema = require('../data/schema');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const piecesRef = db.collection(PATH.PIECES);

app.get('/pieces', (req, res) => {
  piecesRef.get()
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

app.post('/createPiece', (req, res) => {
  const { body } = req;
  const validation = pieceSchema.validate(body);
  if (validation.error) {
    res.status(HTTP_CODES.BAD_REQUEST).send(RESPONSES.BAD_REQUEST(validation.error));
    return;
  }

  const docRef = piecesRef.doc();
  const { id } = docRef;
  docRef.set({ ...body, id })
    .then((doc) => {
      res.status(HTTP_CODES.CREATED).send(doc);
    })
    .catch((error) => {
      res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(RESPONSES.INTERNAL_SERVER_ERROR(error));
    });
});

app.get('*', (_, res) => {
  res.status(HTTP_CODES.NOT_FOUND).send(RESPONSES.NOT_FOUND);
});

module.exports = app;
