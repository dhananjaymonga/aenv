
const mongoose = require("mongoose");
const Review = require("../modules/review"); 
const User =require("../modules/user")
const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  image: {
    url: { 
      type: String, 
      trim: true,
      default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60", // ✅ New Default Image
    },
    filename: { type: String },
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
 
  owner: {
    type:mongoose. Schema.Types.ObjectId,
    ref: 'User' 
},
category: {
  type: String,
  enum: [
    "Amazing Pools",
    "Farms",
    "Beach",
    
    "Treehouses",
    "Historical Homes",
    "OMG!",
    "Cabins",
    "Camping",
    "Lakefront",
    "Tiny Homes",
    "Design",
    "Arctic",
    "Island",
    "Caves",
    "Desert",
    "Vineyards",
    "Windmills",
    "Ryokans",
    "Domes",
    "Towers",
    "Barns",
    "Lofts",
    "Earth Homes",
    "Houseboats",
    "Luxury",
    "New",
    "Ski",
    "Nature",
    "Lake",
    "Mountain",
    "Historic Homes",
    "City",
  ],
  required: [true, "Category is required!"], // ✅ Custom error message
},

}, { timestamps: true });
// console.log(hi)


ListingSchema.post("findOneAndDelete", async function (listing) {   
  if (listing) {
      await Review.deleteMany({
          _id: { $in: listing.reviews }
      });
  }
})
  

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;

