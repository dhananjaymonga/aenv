// const express = require('express');
// const router = express.Router();
// const Listing=require("../modules/listing")
// const Review=require("../modules/review")
// const wrapAsync = require('../utils/wrapAsync');
// const ExpressError = require('../utils/ExpressError');
// const { listingSchema, reviewSchema } = require('../schema');

const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../modules/listing");
const Review = require("../modules/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require('../utils/ExpressError');

const { listingSchema, reviewSchema } = require('../schema');

// Middleware to validate review
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body.review);
    if (error) {
        return res.status(400).json({ error: error.details.map(e => e.message) });
    }
    next();
};

// Create a new review
router.post("/", validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    console.log(req.id)
    const listing = await Listing.findById(id);
    
    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }

    const review = new Review(req.body.review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "New Review Created");

    res.redirect(`/listings/${id}`);
}));

// Delete a review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); 
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");

    res.redirect(`/listings/${id}`);
}));

module.exports = router;
