const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: {  // ✅ Capital "C" hata kar "comment" kar diya
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,  // ✅ User ID reference
    ref: "User"  // ✅ Reference to User model
},

});

module.exports = mongoose.model("Review", reviewSchema);
