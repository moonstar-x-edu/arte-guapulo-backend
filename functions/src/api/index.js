const express = require('express');
const bodyParser = require('body-parser');
const { HTTP_CODES, RESPONSES, PATH } = require('../constants');
const { db } = require('../initializers');
const { createSchema, updateSchema } = require('../data/schemas');

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const piecesRef = db.collection(PATH.PIECES);

app.get('/meta', (req, res) => {
  return piecesRef.get()
    .then((snapshot) => {
      const quantity = snapshot.docs.length;
      const ids = snapshot.docs.map((doc) => doc.data().id);

      const meta = {
        quantity,
        ids
      };

      return res.status(HTTP_CODES.OK).send(RESPONSES.OK(meta));
    })
    .catch((error) => {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(RESPONSES.INTERNAL_SERVER_ERROR(error));
    });
});

app.get('/all', (req, res) => {
  return piecesRef.get()
    .then((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());

      return res.status(HTTP_CODES.OK).send(RESPONSES.OK(data));
    })
    .catch((error) => {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(RESPONSES.INTERNAL_SERVER_ERROR(error));
    });
});

app.get('/:id', (req, res) => {
  const { id } = req.params;

  return piecesRef.doc(id).get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(HTTP_CODES.NOT_FOUND).send(RESPONSES.NOT_FOUND(
          `Piece with id ${id} does not exist.`
        ));
      }

      return res.status(HTTP_CODES.OK).send(RESPONSES.OK(doc.data()));
    })
    .catch((error) => {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(RESPONSES.INTERNAL_SERVER_ERROR(error));
    });
});

app.get('/', (req, res) => {
  return res.status(HTTP_CODES.BAD_REQUEST).send(RESPONSES.BAD_REQUEST(
    'You need to specify an id parameter!'
  ));
});

app.post('/create', (req, res) => {
  const { body } = req;
  const validation = createSchema.validate(body, { convert: false });

  if (validation.error) {
    return res.status(HTTP_CODES.BAD_REQUEST).send(RESPONSES.BAD_REQUEST(validation.error));
  }

  const docRef = piecesRef.doc();
  const { id } = docRef;
  const document = Object.assign({}, body, { id });

  return docRef.set(document)
    .then((result) => {
      const data = {
        writeTime: result.writeTime.nanoseconds / 1e9,
        document
      };

      return res.status(HTTP_CODES.CREATED).send(RESPONSES.CREATED(data));
    })
    .catch((error) => {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(RESPONSES.INTERNAL_SERVER_ERROR(error));
    });
});

app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const refToDelete = piecesRef.doc(id);

  return refToDelete.get()
    .then((doc) => {

      return refToDelete.delete()
        .then((result) => {
          const data = {
            writeTime: result.writeTime.nanoseconds / 1e9,
            deleted: doc.data()
          };

          return res.status(HTTP_CODES.OK).send(RESPONSES.OK(data));
        })
        .catch((error) => {
          return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(RESPONSES.INTERNAL_SERVER_ERROR(error));
        });
    })
    .catch((error) => {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(RESPONSES.INTERNAL_SERVER_ERROR(error));
    });
});

app.delete('/delete', (req, res) => {
  return res.status(HTTP_CODES.BAD_REQUEST).send(RESPONSES.BAD_REQUEST(
    'You need to specify an id parameter!'
  ));
});

app.put('/update/:id', (req, res) => {
  const { body, params: { id } } = req;
  const validation = updateSchema.validate(body, { convert: false });

  if (validation.error) {
    return res.status(HTTP_CODES.BAD_REQUEST).send(RESPONSES.BAD_REQUEST(validation.error));
  }

  const refToUpdate = piecesRef.doc(id);

  return refToUpdate.update(body)
    .then((result) => {

      return refToUpdate.get()
        .then((doc) => {
          const data = {
            writeTime: result.writeTime.nanoseconds / 1e9,
            updated: doc.data()
          };

          return res.status(HTTP_CODES.OK).send(RESPONSES.OK(data));
        })
        .catch((error) => {
          return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(RESPONSES.INTERNAL_SERVER_ERROR(error));
        });
    })
    .catch((error) => {
      return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(RESPONSES.INTERNAL_SERVER_ERROR(error));
    });
});

app.put('/update', (req, res) => {
  return res.status(HTTP_CODES.BAD_REQUEST).send(RESPONSES.BAD_REQUEST(
    'You need to specify an id parameter!'
  ));
});

app.get('*', (_, res) => {
  return res.status(HTTP_CODES.NOT_FOUND).send(RESPONSES.NOT_FOUND(
    'The requested resource was not found. Please check that the endpoint is written correctly.'
  ));
});

app.post('*', (_, res) => {
  return res.status(HTTP_CODES.NOT_FOUND).send(RESPONSES.NOT_FOUND(
    'The requested resource was not found. Please check that the endpoint is written correctly.'
  ));
});

app.delete('*', (_, res) => {
  return res.status(HTTP_CODES.NOT_FOUND).send(RESPONSES.NOT_FOUND(
    'The requested resource was not found. Please check that the endpoint is written correctly.'
  ));
});

app.put('*', (_, res) => {
  return res.status(HTTP_CODES.NOT_FOUND).send(RESPONSES.NOT_FOUND(
    'The requested resource was not found. Please check that the endpoint is written correctly.'
  ));
});

module.exports = app;
