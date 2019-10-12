const Joi = require('@hapi/joi');

const createSchema = Joi.object({
  image: Joi.string()
    .trim()
    .uri()
    .required(),
  coordinates: Joi.object({
    latitude: Joi.number()
      .min(-90)
      .max(90)
      .required()
      .strict(),
    longitude: Joi.number()
      .min(-180)
      .max(180)
      .required()
      .strict()
  }).required(),
  authors: Joi.array()
    .items(Joi.object({
      facebook: Joi.string()
        .required()
        .allow('')
        .allow(null),
      twitter: Joi.string()
        .required()
        .allow('')
        .allow(null),
      instagram: Joi.string()
        .required()
        .allow('')
        .allow(null)
    }))
    .required(),
  tags: Joi.array()
    .items(Joi.string())
    .required()
});

module.exports = createSchema;
