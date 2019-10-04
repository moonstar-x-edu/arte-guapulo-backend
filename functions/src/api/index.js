const express = require('express');
const bodyParser = require('body-parser');
const { HTTP_CODES, RESPONSES, PATH } = require('../constants');
const { db } = require('../initializers');
const { createSchema, updateSchema } = require('../data/schemas');

const app = express();
app.use(bodyParser.json());

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

app.get('/all', (req, res) => {
  piecesRef.get()
    .then((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());

      res.status(HTTP_CODES.OK).send(RESPONSES.OK(data));
    })
    .catch((error) => {
      res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(RESPONSES.INTERNAL_SERVER_ERROR(error));
    });
});

app.get('/:id', (req, res) => {
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

app.get('/', (req, res) => {
  res.status(HTTP_CODES.BAD_REQUEST).send(RESPONSES.BAD_REQUEST(
    'You need to specify an id parameter!'
  ));
});

app.post('/create', (req, res) => {
  const { body } = req;
  const validation = createSchema.validate(body, { convert: false });

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

app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const refToDelete = piecesRef.doc(id);

  refToDelete.get()
    .then((doc) => {

      refToDelete.delete()
        .then((result) => {
          const data = {
            writeTime: result.writeTime.nanoseconds / 1e9,
            deleted: doc.data()
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

app.delete('/delete', (req, res) => {
  res.status(HTTP_CODES.BAD_REQUEST).send(RESPONSES.BAD_REQUEST(
    'You need to specify an id parameter!'
  ));
});

app.put('/update/:id', (req, res) => {
  const { body, params: { id } } = req;
  const validation = updateSchema.validate(body, { convert: false });

  if (validation.error) {
    res.status(HTTP_CODES.BAD_REQUEST).send(RESPONSES.BAD_REQUEST(validation.error));
    return;
  }

  const refToUpdate = piecesRef.doc(id);

  refToUpdate.update(body)
    .then((result) => {

      refToUpdate.get()
        .then((doc) => {
          const data = {
            writeTime: result.writeTime.nanoseconds / 1e9,
            updated: doc.data()
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

app.put('/update', (req, res) => {
  res.status(HTTP_CODES.BAD_REQUEST).send(RESPONSES.BAD_REQUEST(
    'You need to specify an id parameter!'
  ));
});


app.get('*', (_, res) => {
  res.status(HTTP_CODES.NOT_FOUND).send(RESPONSES.NOT_FOUND(
    'The requested resource was not found. Please check that the endpoint is written correctly.'
  ));
});

app.post('*', (_, res) => {
  res.status(HTTP_CODES.NOT_FOUND).send(RESPONSES.NOT_FOUND(
    'The requested resource was not found. Please check that the endpoint is written correctly.'
  ));
});

app.delete('*', (_, res) => {
  res.status(HTTP_CODES.NOT_FOUND).send(RESPONSES.NOT_FOUND(
    'The requested resource was not found. Please check that the endpoint is written correctly.'
  ));
});

app.put('*', (_, res) => {
  res.status(HTTP_CODES.NOT_FOUND).send(RESPONSES.NOT_FOUND(
    'The requested resource was not found. Please check that the endpoint is written correctly.'
  ));
});

module.exports = app;
