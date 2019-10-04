const HTTP_CODES = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500
};

const PATH = {
  PIECES: 'pieces'
};

const RESPONSES = {
  NOT_FOUND: {
    status: HTTP_CODES.NOT_FOUND,
    message: 'The requested resource was not found. Please check that the endpoint is written correctly.'
  },
  INTERNAL_SERVER_ERROR: (error) => ({
    status: HTTP_CODES.INTERNAL_SERVER_ERROR,
    message: 'Something went wrong when accessing the requested resource.',
    error
  })
};

module.exports = {
  HTTP_CODES,
  PATH,
  RESPONSES
};
