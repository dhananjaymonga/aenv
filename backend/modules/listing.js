// const mongoose = require("mongoose");
// const ListingSchema = new mongoose.Schema({
//   title: { type: String, required: true, trim: true },
//   description: { type: String, required: true, trim: true },
//   image: {
//     url: { 
//       type: String, 
//       default: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
//       trim: true 
//     }, // Default URL
//   },
//   price: { type: Number, required: true, min: 0 },
//   location: { type: String, required: true, trim: true },
//   country: { type: String, required: true, trim: true },
//   amenities: {
//     type: [String],
//     default: [],
//     validate: {
//       validator: function (arr) {
//         return Array.isArray(arr) && arr.every(item => typeof item === "string");
//       },
//       message: "Amenities must be an array of strings.",
//     },
//     set: (arr) => [...new Set(arr)], // Remove duplicates
//   },
// }, { timestamps: true })
// const Listing = mongoose.model("Listing", ListingSchema);
// module.exports = Listing;
const mongoose = require("mongoose");
const Review = require("./review"); 
const User =require("./user")
const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  image: {
    url: { 
      type: String, 
      trim: true,
      default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60", // ✅ New Default Image
    },
  },
  price: { type: Number, required: true, min: 0 },
  location: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  amenities: {
    type: [String],
    default: [],
    set: (arr) => [...new Set(arr)], // ✅ Remove duplicates
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    red:"User"
  }

}, { timestamps: true });

ListingSchema.post("findOneAndDelete", async function (listing) {   
  if (listing) {
      await Review.deleteMany({
          _id: { $in: listing.reviews }
      });
  }
});console.log(hi)


const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;

