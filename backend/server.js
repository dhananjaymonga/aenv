const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../backend/modules/listing");
const Port = 5000;
const MONGO_URI = "mongodb://localhost:27017/adim";
const path = require("path");

const wrapAsync = require("./utils/WrapAsync");
const expressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Joi = require("joi");
const listingSchema = require("./schema"); // Ensure schema is correctly imported
const engine = require("ejs-mate");

app.set("view engine", "ejs");
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use((req, res, next) => {
    if (req.body.listing && typeof req.body.listing.amenities === "string") {
        req.body.listing.amenities = [req.body.listing.amenities];
    }
    next();
});
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body.listing);
    if (error) {
        return res.status(400).json({ error: error.details.map(e => e.message) });
         
    }
    next();
};

main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URI);
}

app.get("/", wrapAsync(async (req, res) => {
  res.send("hi");
}));

// Get all listings
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

// Form for new listing
app.get("/listings/new", wrapAsync(async (req, res) => {
  res.render("listings/new");
}));

// Show listing details
app.get("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show", { listing });
}));

// Create new listing
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    let newListing = req.body.listing;

    // Default amenities if missing
    if (!Array.isArray(newListing.amenities)) {
        newListing.amenities = newListing.amenities ? [newListing.amenities] : [];
    }

    // Ensure image exists
    if (!newListing.image || !newListing.image.url) {
        newListing.image = { url: "https://via.placeholder.com/300" };
    }

    const listing = new Listing(newListing);
    await listing.save();

    res.redirect("/listings");
}));

// Edit listing form
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
}));

// Update listing
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;

    // If no image provided, set default
    if (!req.body.listing.image || !req.body.listing.image.url) {
        req.body.listing.image = { url: "https://via.placeholder.com/300" };
    }

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// Delete listing
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

// 404 Not Found
app.use((req, res) => {
  res.status(404).render("indexnotfound.ejs");
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  res.status(statusCode).render("listings/error", { statusCode, message });
});

// Start server
app.listen(Port, () => {
  console.log(`Server started on port ${Port}`);
});
