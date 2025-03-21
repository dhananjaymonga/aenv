const Listing = require("listing");
const Review = require("../modules/review");
const wrapAsync = require("../utils/WrapAsync");
const { reviewSchema } = require("../schema");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body.review);
  if (error) {
    return res.status(400).json({ error: error.details.map(e => e.message) });
  }
  next();
};
module.exports = {
    createReview: wrapAsync(async (req, res) => {
      const { id } = req.params;
      const listing = await Listing.findById(id);
  
      if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
      }
  
      const review = new Review(req.body.review);
      review.author = req.user._id;
      await review.save();
  
      listing.reviews.push(review);
      await listing.save();
  
      req.flash("success", "New Review Created");
      res.redirect(`/listings/${id}`);
    }),
  
    deleteReview: wrapAsync(async (req, res) => {
      const { id, reviewId } = req.params;
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
      req.flash("success", "Review Deleted");
      res.redirect(`/listings/${id}`);
    }),
  };