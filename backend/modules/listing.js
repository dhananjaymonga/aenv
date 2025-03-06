const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  image: {
    url: { 
      type: String, 
      default: "https://via.placeholder.com/300", 
      trim: true 
    }, // Default URL
  },
  price: { type: Number, required: true, min: 0 },
  location: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  amenities: {
    type: [String],
    default: [],
    validate: {
      validator: function (arr) {
        return Array.isArray(arr) && arr.every(item => typeof item === "string");
      },
      message: "Amenities must be an array of strings.",
    },
    set: (arr) => [...new Set(arr)], // Remove duplicates
  },
}, { timestamps: true });

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
