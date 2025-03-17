// const express = require('express');
// const router = express.Router();
// const Listing=require("../modules/listing")
// const wrapAsync = require('../utils/wrapAsync');
// // const ExpressError = require('../utils/ExpressError');

// const { listingSchema, reviewSchema } = require('../schema');

// const ExpressError = require('../utils/ExpressError');
// const Joi = require('joi');
// const session =require("express-session")

// const flash=require("connect-flash")
// const {isLoggedIn, isOwner,saveRedirectUrl}=require("../Middleware")

// const validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body.listing);
//     if (error) {
//         return res.status(400).json({ error: error.details.map(e => e.message) });
         
//     }
//     next();
// };
// router.get("/", wrapAsync(async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index", { allListings });
//   }));
  
//   // Form for new listing
//   router.get("/new",isLoggedIn, wrapAsync(async (req, res) => {
//     console.log(req.user)
  
   
//       res.render("listings/new");

    
//   }));
  
//   // Show listing details
//   router.get("/:id", wrapAsync(async (req, res) => {
//     const listing = await Listing.findById(req.params.id)
//         .populate({
//             path: "reviews",
//             populate: { path: "author" }  // ✅ Populate author inside reviews
//         })
//         .populate("owner");

//     if (!listing) {
//         req.flash("error", "Listing not found!");
//         return res.redirect("/listings");
//     }

//     res.render("listings/show", { listing, currentUser: req.user });
// }));

  
//   // Create new listing
//   router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
//     let newListing = req.body.listing;

//     if (!Array.isArray(newListing.amenities)) {
//         newListing.amenities = newListing.amenities ? [newListing.amenities] : [];
//     }

//     if (!newListing.image || !newListing.image.url) {
//         newListing.image = { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60" };
//     }

//     // ✅ Create new listing and assign owner
//     const listing = new Listing(newListing);
//     listing.owner = req.user._id; // ✅ Assign the logged-in user as the owner

//     await listing.save();
//     req.flash("success", "New Listing Created");

//     res.redirect(`/listings/${listing._id}`); // ✅ Redirect to newly created listing
// }));


  
//   // Edit listing form
//   router.get("/:id/edit",isLoggedIn, saveRedirectUrl, isOwner, wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     if(!listing){
//       req.flash("error", " Listings  you requested for does not exist  ");
// res.redirect("/listings")
//     }
//     res.render("listings/edit", { listing });
//   }));
  
//   // Update listing
//   router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
//     const { id } = req.params;
  
//     if (!req.body.listing.image || !req.body.listing.image.url) {
//       req.body.listing.image = { url: "https://via.placeholder.com/300" };
//     }
  
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     req.flash("success", "Updated Listings Updates  ");

//     res.redirect(`/listings/${id}`);
//   }));
  
//   // Delete listing
//   router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     await Listing.findByIdAndDelete(id);
//     req.flash("success", " Listingsn Deleted");

//     res.redirect("/listings");
//   }));
  
//   module.exports = router;
const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listingController");
const multer =require("multer")
const { isLoggedIn, isOwner, saveRedirectUrl } = require("../Middleware");
const { upload } = require("../cloudConfig"); 

// router.get("/", listingController.getAllListings);
// router.get("/new", isLoggedIn, listingController.getListingForm);
// router.get("/:id", listingController.getListingById);
// router.post("/", isLoggedIn, listingController.createListing);
// router.get("/:id/edit", isLoggedIn, saveRedirectUrl, isOwner, listingController.getEditListingForm);
// router.put("/:id", isLoggedIn, isOwner, listingController.updateListing);
// router.delete("/:id", isLoggedIn, isOwner, listingController.deleteListing);
// module.exports = router;
router.route("/")
  .get(listingController.getAllListings)
    .post( isLoggedIn, upload.single("image"), listingController.createListing);

router.get("/new", isLoggedIn, listingController.getListingForm);

router.route("/:id")
  .get(listingController.getListingById)
  .put(isLoggedIn, isOwner,upload.single("image"), listingController.updateListing)
  .delete(isLoggedIn, isOwner, listingController.deleteListing);

router.get("/:id/edit", isLoggedIn, saveRedirectUrl, isOwner, listingController.getEditListingForm);

module.exports = router;