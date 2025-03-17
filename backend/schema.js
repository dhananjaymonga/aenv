const Joi = require("joi");
const review = require("./modules/review");

const listingSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  image: Joi.object({
    url: Joi.string()
      .uri()
      .allow("") // ✅ Allow empty string to avoid validation error
      .default("https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"), // ✅ Default image URL
  }).default({ 
    url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
  }), // ✅ Ensure `image` object exists
  price: Joi.number().min(0).required(),
  location: Joi.string().min(2).max(100).required(),
  country: Joi.string().min(2).max(100).required(),
  category: Joi.string().valid(
    "Amazing Pools",
    "Farms",
    "Icons",
    "Amazing Views",
    "Creative Spaces",
    "Bed & Breakfasts",
    "Rooms",
    "OMG!"
  ).required(),
  amenities: Joi.alternatives().try(
    Joi.array().items(Joi.string().min(2).max(50)), // If array, validate each item
    Joi.string().min(2).max(50) // If single string, allow it
  ).default([]),

});

// module.exports = { listingSchema };




const reviewSchema = Joi.object({
    comment: Joi.string().min(3).max(500).required().messages({
        "string.empty": "Comment cannot be empty",
        "string.min": "Comment must be at least 3 characters long",
    }),
    rating: Joi.number().min(1).max(5).required().messages({
        "number.base": "Rating must be a number",
        "number.min": "Rating must be at least 1",
        "number.max": "Rating cannot be more than 5",
    }),
});

module.exports = { listingSchema, reviewSchema };



