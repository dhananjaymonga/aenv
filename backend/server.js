const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");

const listingRoutes = require("./routes/listings");
const reviewRoutes = require("./routes/review");
const UserRouter = require("./routes/user")

// const reviewRoutes = require("./routes/reviews");

const wrapAsync = require("./utils/WrapAsync");
const expressError = require("./utils/ExpressError");
const { reviewSchema } = require("./schema");

const Listing = require("./modules/listing");
const Review = require("./modules/review");
const session =require("express-session")
const MongoStore= require("connect-mongo")
const flash=require("connect-flash")
const passport =require("passport")
const LocalStrategy= require("passport-local")
const multer = require("multer");
// const upload = multer(); 
const User=require("./modules/user")
// const multer = require("multer");
const { upload } = require("./cloudConfig"); // ✅ Cloudinary upload config
const { error } = require("console");

require("dotenv").config();
require("./googleconfig"); // Make sure Passport is required
const FacebookStrategy = require("passport-facebook").Strategy;  // ✅ Correct Import


const Port = 5000;
const dbURL = process.env.MONGO_URI;
console.log(dbURL)
console.log(process.env. Secret);

console.log(process.env.GOOGLE_CLIENT_ID);
console.log(process.env.GOOGLE_CLIENT_SECRET);
// Mongoose connection
mongoose.connect(dbURL)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err));

console.log(process.env. Secret);
  const store=    MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:process.env. Secret,
    },
    touchAfter:24*36,

})
store.on("error", (err) => {
  console.log("ERROR IN MONGO Session Store", err);
});

  const sessionOption={
    store,
    secret:process.env. Secret,
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
// console.log("Cloudinary Name:", process.env.CLOUD_NAME);
// console.log("Cloudinary Name:", process.env.CLOUDINARY_API_KEY);
// console.log("Cloudinary Name:", process.env.CLOUDINARY_API_SECRET);
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));  
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    const excludedPaths = ["/login", "/signup", "/auth/google", "/auth/google/callback"];
  
    if (!req.isAuthenticated() && !excludedPaths.includes(req.path)) {
      req.session.redirectUrl = req.originalUrl;
      console.log("🔄 Storing Redirect URL:", req.session.redirectUrl);
    } else {
      delete req.session.redirectUrl;
    }
    next();
  });
  
app.use((req,res,next)=>{
    res.locals.currentUser = req.user || null;  
    res.locals.success = req.flash("success");  
    res.locals.error = req.flash("error");
    console.log("Flash Messages in Middleware:", res.locals.success, res.locals.error);
    next();
});

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = new User({
              googleId: profile.id,
              username: profile.displayName,
              email: profile.emails[0].value,
            });
            await user.save();
          }
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ["id", "displayName", "photos", "email"],
      },
      (accessToken, refreshToken, profile, done) => {
        // Save user details in database
        return done(null, profile);
      }
    )
  );

app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));

// Facebook Callback Route
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    failureFlash: true, // Error messages show karne ke liye
  }),
  (req, res) => {
    console.log("✅ Google Login Successful!");
      console.log("🔍 Stored Redirect URL:", req.session.redirectUrl);
      
      let redirectUrl = req.session.redirectUrl || "/listings"; // ✅ Default fallback
      delete req.session.redirectUrl;
      
      console.log("🚀 Redirecting to:", redirectUrl);
      res.redirect(redirectUrl);
  }
);
app.use((err, req, res, next) => {
    console.error("🔥 ERROR:", err);   
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    res.status(statusCode).json({ status: "error", message, error: err.stack });
});
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  app.get("/auth/google/callback", 
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      console.log("✅ Google Login Successful!");
      console.log("🔍 Stored Redirect URL:", req.session.redirectUrl);
      
      let redirectUrl = req.session.redirectUrl || "/listings"; // ✅ Default fallback
      delete req.session.redirectUrl;
      
      console.log("🚀 Redirecting to:", redirectUrl);
      res.redirect(redirectUrl);
    }
  );

  
    


// Routes



app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/",UserRouter)

// app.get("/gndhruser", async (req,res)=>{
//     let fakeuser= new User({
//         email:"student@gmail.com",
//         username:"dhan"
//     })
//     let registeruser=await User.register(fakeuser,"helloworld")
//     res.send(registeruser)
// })

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
