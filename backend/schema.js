const Joi = require("joi");

const listingSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  image: Joi.object({
    url: Joi.string().uri().optional(), // Allow missing or empty URL
  }).optional(), // The whole image object is optional
  price: Joi.number().min(0).required(),
  location: Joi.string().min(2).max(100).required(),
  country: Joi.string().min(2).max(100).required(),
  amenities: Joi.alternatives().try(
      Joi.array().items(Joi.string().min(2).max(50)), // If array, validate each item
      Joi.string().min(2).max(50) // If single string, allow it
  ).default([]),
});

module.exports = listingSchema;
