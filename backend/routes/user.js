const express = require("express");
const router = express.Router();
const User = require("../modules/user");
const wrapAsync = require('../utils/wrapAsync');

const ExpressError = require('../utils/ExpressError');
const Joi = require('joi');
const session =require("express-session")

const flash=require("connect-flash");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("users/signup");
});

router.post("/signup", wrapAsync(async(req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            req.flash("error", "All fields are required!");
            return res.redirect("/signup");
        }

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        
        console.log("User Registered:", registeredUser);
        
        req.flash("success", "Welcome to Airbnb!");
        res.redirect("/listings");
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}));
router.post("/login",
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: "Invalid email or password!" // 👈 Yeh message flash karega
    }),
    (req, res) => {
      req.flash("success", "Welcome back!");
      res.redirect("/listings");
    }
  );
  
router.get("/login",(req,res)=>{
    res.render("users/login")
})
router.get("logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err)
        }
        req.flash("success", "You have logged out successfully!");
        res.redirect("/listings")
    })
})

module.exports = router;
