const Listing = require("../modules/listing");
const { listingSchema } = require("../schema");
const wrapAsync = require("../utils/WrapAsync");
const ExpressError = require("../utils/ExpressError");
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body.listing);
    if (error) {
      return res.status(400).json({ error: error.details.map(e => e.message) });
    }
    next();
  };
  module.exports = {
    getAllListings: wrapAsync(async (req, res) => {
      const allListings = await Listing.find({});
      res.render("listings/index", { allListings });
    }),
  
    getListingForm: wrapAsync(async (req, res) => {
      res.render("listings/new");
    }),
  
    getListingById: wrapAsync(async (req, res) => {
      const listing = await Listing.findById(req.params.id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
  
      if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
      }
      res.render("listings/show", { listing, currentUser: req.user });
    }),
  
    createListing: wrapAsync(async (req, res) => {
      let newListing = req.body.listing;

      console.log("Request Body:", req.body); // Debugging
  
      if (!req.body.listing) {
          throw new ExpressError("Invalid Listing Data", 400);
      }
  
  
     
    if (!Array.isArray(newListing.amenities)) {
      newListing.amenities = newListing.amenities ? [newListing.amenities] : [];
    }
  
      const listing = new Listing(newListing);
      listing.owner = req.user._id;
      await listing.save();
      
      req.flash("success", "New Listing Created");
      res.redirect(`/listings/${listing._id}`);
  }),
  
  
  
    getEditListingForm: wrapAsync(async (req, res) => {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
      }
      res.render("listings/edit", { listing });
    }),
  
    updateListing: wrapAsync(async (req, res) => {
      const { id } = req.params;
      if (!req.body.listing.image || !req.body.listing.image.url) {
        req.body.listing.image = { url: "https://via.placeholder.com/300" };
      }
      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      req.flash("success", "Listing Updated");
      res.redirect(`/listings/${id}`);
    }),
  
    deleteListing: wrapAsync(async (req, res) => {
      const { id } = req.params;
      await Listing.findByIdAndDelete(id);
      req.flash("success", "Listing Deleted");
      res.redirect("/listings");
    }),
  };
  