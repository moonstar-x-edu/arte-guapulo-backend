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
  OK: (data) => ({
    status: HTTP_CODES.OK,
    success: true,
    data
  }),
  CREATED: (data) => ({
    status: HTTP_CODES.CREATED,
    success: true,
    data
  }),
  NOT_FOUND: (message) => ({
    status: HTTP_CODES.NOT_FOUND,
    success: false,
    message
  }),
  INTERNAL_SERVER_ERROR: (error) => ({
    status: HTTP_CODES.INTERNAL_SERVER_ERROR,
    success: false,
    message: 'Something went wrong when accessing the requested resource.',
    error
  }),
  BAD_REQUEST: (error) => ({
    status: HTTP_CODES.BAD_REQUEST,
    success: false,
    message: "The server couldn't process your request.",
    error
  })
};

module.exports = {
  HTTP_CODES,
  PATH,
  RESPONSES
};
