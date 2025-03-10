const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");

const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/review");
// const reviewRoutes = require("./routes/reviews");

const wrapAsync = require("./utils/WrapAsync");
const expressError = require("./utils/ExpressError");
const { reviewSchema } = require("./schema");

const Listing = require("./modules/listing");
const Review = require("./modules/review");
const session =require("express-session")
const flash=require("connect-flash")
const passport =require("passport")
const Li21\ocalStrategy= require("passport-local")
const User=require("./modules/user")

const Port = 5000;
const MONGO_URI = "mongodb://localhost:27017/adim";


// Mongoose connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));


  const sessionOption={
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
}
// Middleware
app.set("view engine", "ejs");
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(session(sessionOption))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate))
app.use((req,res,next)=>{
    console.log("Flash Messages in Middleware:", req.flash("success"), req.flash("error"))
    res.locals.success = req.flash("success")[0] || ""; // Ensure it's always a string
    res.locals.error = req.flash("error")[0] || "";

        next()
})


// Routes
app.get("/", wrapAsync(async (req, res) => {
    res.send("hii");
}));

app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);

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
