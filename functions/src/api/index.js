const express = require('express');
const bodyParser = require('body-parser');
const { HTTP_CODES, RESPONSES, PATH } = require('../constants');
const { db } = require('../initializers');
const pieceSchema = require('../data/schema');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const piecesRef = db.collection(PATH.PIECES);

app.get('/meta', (req, res) => {
  piecesRef.get()
    .then((snapshot) => {
      const quantity = snapshot.docs.length;
      const ids = snapshot.docs.map((doc) => doc.data().id);

      const meta = {
        quantity,
        ids
      };

      res.status(HTTP_CODES.OK).send(RESPONSES.OK(meta));
    })
    .catch((error) => {
      res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(RESPONSES.INTERNAL_SERVER_ERROR(error));
    });
});

app.get('/pieces', (req, res) => {
  piecesRef.get()
    .then((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());

      res.status(HTTP_CODES.OK).send(RESPONSES.OK(data));
    })
    .catch((error) => {
      res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(RESPONSES.INTERNAL_SERVER_ERROR(error));
    });
});

app.get('/piece/:id', (req, res) => {
  const { id } = req.params;

  piecesRef.doc(id).get()
    .then((doc) => {
      if (!doc.exists) {
        res.status(HTTP_CODES.NOT_FOUND).send(RESPONSES.NOT_FOUND(
          `Piece with id ${id} does not exist.`
        ));
        return;
      }

      res.status(HTTP_CODES.OK).send(RESPONSES.OK(doc.data()));
    })
    .catch((error) => {
      res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(RESPONSES.INTERNAL_SERVER_ERROR(error));
    });
});

app.get('/piece', (req, res) => {
  res.status(HTTP_CODES.BAD_REQUEST).send(RESPONSES.BAD_REQUEST(
    'You need to specify an id parameter!'
  ));
});

app.post('/createPiece', (req, res) => {
  const { body } = req;
  const validation = pieceSchema.validate(body, { convert: false });

  if (validation.error) {
    res.status(HTTP_CODES.BAD_REQUEST).send(RESPONSES.BAD_REQUEST(validation.error));
    return;
  }

  const docRef = piecesRef.doc();
  const { id } = docRef;
  const document = {
    ...body,
    id
  };

  docRef.set(document)
    .then((result) => {
      const data = {
        writeTime: result.writeTime.nanoseconds / 1e9,
        document
      };

      res.status(HTTP_CODES.CREATED).send(RESPONSES.CREATED(data));
    })
    .catch((error) => {
      res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(RESPONSES.INTERNAL_SERVER_ERROR(error));
    });
});

app.delete('/deletePiece/:id', (req, res) => {
  const { id } = req.params;
  const refToRemove = piecesRef.doc(id);

  refToRemove.get()
    .then((doc) => {
      const removed = doc.data();

      refToRemove.delete()
        .then((result) => {
          const data = {
            writeTime: result.writeTime.nanoseconds / 1e9,
            removed
          };

          res.status(HTTP_CODES.OK).send(RESPONSES.OK(data));
        })
        .catch((error) => {
          res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(RESPONSES.INTERNAL_SERVER_ERROR(error));
        });
    })
    .catch((error) => {
      res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(RESPONSES.INTERNAL_SERVER_ERROR(error));
    });
});

app.delete('/deletePiece', (req, res) => {
  res.status(HTTP_CODES.BAD_REQUEST).send(RESPONSES.BAD_REQUEST(
    'You need to specify an id parameter!'
  ));
});

app.get('*', (_, res) => {
  res.status(HTTP_CODES.NOT_FOUND).send(RESPONSES.NOT_FOUND(
    'The requested resource was not found. Please check that the endpoint is written correctly.'
  ));
});

module.exports = app;
