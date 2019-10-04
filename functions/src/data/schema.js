const Joi = require('@hapi/joi');

const schema = Joi.object({
  id: Joi.string(),
  image: Joi.string().required(),
  coordinates: Joi.object({
    latitude: Joi.number().required().strict(),
    longitude: Joi.number().required().strict()
  }).required(),
  authors: Joi.array().items(Joi.object({
    facebook: Joi.string().required().allow(null),
    twitter: Joi.string().required().allow(null),
    instagram: Joi.string().required().allow(null)
  })).required(),
  tags: Joi.array().items(Joi.string()).required()
});

module.exports = schema;
