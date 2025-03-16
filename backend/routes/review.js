// // const express = require('express');
// // const router = express.Router();
// // const Listing=require("../modules/listing")
// // const Review=require("../modules/review")
// // const wrapAsync = require('../utils/wrapAsync');
// // const ExpressError = require('../utils/ExpressError');
// // const { listingSchema, reviewSchema } = require('../schema');

// const express = require("express");
// const router = express.Router({ mergeParams: true });
// const Listing = require("../modules/listing");
// const Review = require("../modules/review");
// const wrapAsync = require("../utils/WrapAsync");
// const ExpressError = require('../utils/ExpressError');
// const {  isLoggedIn,isReviewAuthor } = require("../Middleware");
// const { listingSchema, reviewSchema } = require('../schema');

// // Middleware to validate review
// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body.review);
//     if (error) {
//         return res.status(400).json({ error: error.details.map(e => e.message) });
//     }
//     next();
// };

// // Create a new review
// router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);

//     if (!listing) {
//         req.flash("error", "Listing not found");
//         return res.redirect("/listings");
//     }

//     const review = new Review(req.body.review);
//     review.author = req.user._id;  // ✅ Assign logged-in user as author
//     await review.save();

//     listing.reviews.push(review);
//     await listing.save();

//     req.flash("success", "New Review Created");
//     res.redirect(`/listings/${id}`);
// }));


// // Delete a review
// router.delete("/:reviewId",isReviewAuthor,isReviewAuthor, wrapAsync(async (req, res) => {
//     const { id, reviewId } = req.params;

//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); 
//     await Review.findByIdAndDelete(reviewId);
//     req.flash("success", "Review Deleted");

//     res.redirect(`/listings/${id}`);
// }));

// module.exports = router;


const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/reviewController");
const { isLoggedIn, isReviewAuthor } = require("../Middleware");

// router.post("/", isLoggedIn, reviewController.createReview);
// router.delete("/:reviewId", isReviewAuthor, reviewController.deleteReview);

// module.exports = router;

router.route("/")
  .post(isLoggedIn, reviewController.createReview);

router.route("/:reviewId")
  .delete(isReviewAuthor, reviewController.deleteReview);

module.exports = router;
