const express = require('express');
const router = express.Router();
const Listing=require("../modules/listing")
const wrapAsync = require('../utils/wrapAsync');
// const ExpressError = require('../utils/ExpressError');

const { listingSchema, reviewSchema } = require('../schema');

const ExpressError = require('../utils/ExpressError');
const Joi = require('joi');
const session =require("express-session")

const flash=require("connect-flash")


const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body.listing);
    if (error) {
        return res.status(400).json({ error: error.details.map(e => e.message) });
         
    }
    next();
};
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  }));
  
  // Form for new listing
  router.get("/new", wrapAsync(async (req, res) => {
    res.render("listings/new");
  }));
  
  // Show listing details
  router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error", " Listings  you requested for does not exist  ");
res.redirect("/listings")
    }
    res.render("listings/show", { listing });
  }));
  
  // Create new listing
  router.post("/", validateListing, wrapAsync(async (req, res) => {
    let newListing = req.body.listing;
  
    if (!Array.isArray(newListing.amenities)) {
      newListing.amenities = newListing.amenities ? [newListing.amenities] : [];
    }
  
    if (!newListing.image || !newListing.image.url) {
      newListing.image = { 
        url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60" 
      };
    }
  
    const listing = new Listing(newListing);
    await listing.save();
    req.flash("success", "New Listings Created");
    console.log("Flash message set:", req.flash("success")); // Debugging

    res.redirect("/listings");
  }));
  
  // Edit listing form
  router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", " Listings  you requested for does not exist  ");
res.redirect("/listings")
    }
    res.render("listings/edit", { listing });
  }));
  
  // Update listing
  router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
  
    if (!req.body.listing.image || !req.body.listing.image.url) {
      req.body.listing.image = { url: "https://via.placeholder.com/300" };
    }
  
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Updated Listings Updates  ");

    res.redirect(`/listings/${id}`);
  }));
  
  // Delete listing
  router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " Listingsn Deleted");

    res.redirect("/listings");
  }));
  
  module.exports = router;