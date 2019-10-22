const Joi = require('@hapi/joi');

const updateSchema = Joi.object({
  image: Joi.string()
    .trim()
    .uri(),
  'coordinates.latitude': Joi.number()
    .min(-90)
    .max(90)
    .strict(),
  'coordinates.longitude': Joi.number()
    .min(-180)
    .max(180)
    .strict(),
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
        .allow(null),
      justName: Joi.string()
        .required()
        .allow('')
        .allow(null)
    })),
  tags: Joi.array()
    .items(Joi.string())
}).min(1);

module.exports = updateSchema;
