const Listing = require("listing");
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
  
    //   if (!listing) {
    //     req.flash("error", "Listing not found!");
    //     return res.redirect("/listings");
    // }
      if (req.file) {
        newListing.image = {
          url: req.file.path,
          filename: req.file.filename,
        };
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
      let updatedListing = req.body.listing;
    
      // If no new image is uploaded, make sure the existing image is retained
      if (req.file) {
        // If an image is uploaded, update the image field
        updatedListing.image = {
          url: req.file.path,
          filename: req.file.filename,
        };
      } else {
        // If no new image is uploaded, keep the existing image URL (if available)
        const listing = await Listing.findById(id);
        if (listing && listing.image) {
          updatedListing.image = listing.image; // Keep the current image if no new one is uploaded
        }
      }
    
      // If no image URL is specified (e.g., after form submission without an image), set a placeholder
      if (!updatedListing.image || !updatedListing.image.url) {
        updatedListing.image = { url: "https://via.placeholder.com/300" };
      }
    
      // Update the listing with the new data
      await Listing.findByIdAndUpdate(id, { ...updatedListing });
      
      req.flash("success", "Listing Updated");
      res.redirect(`/listings/${id}`); // Redirect to the updated listing page
    }),
    
  
    deleteListing: wrapAsync(async (req, res) => {
      const { id } = req.params;
      await Listing.findByIdAndDelete(id);
      req.flash("success", "Listing Deleted");
      res.redirect("/listings");
    }),
  };
  