// const express = require("express");
// const router = express.Router();
// const User = require("../modules/user");
// const wrapAsync = require('../utils/wrapAsync');

// const ExpressError = require('../utils/ExpressError');
// const Joi = require('joi');
// const session =require("express-session")

// const flash=require("connect-flash");
// const passport = require("passport");
// const {saveRedirectUrl}=require("../Middleware")


// router.get("/signup", (req, res) => {
//     res.render("users/signup");
// });

// router.post("/signup", wrapAsync(async(req, res) => {
//     try {
//         const { username, email, password } = req.body;
        
//         if (!username || !email || !password) {
//             req.flash("error", "All fields are required!");
//             return res.redirect("/signup");
//         }

//         const newUser = new User({ email, username });
//         const registeredUser = await User.register(newUser, password);
        
//         console.log("User Registered:", registeredUser);
//         req.logIn(registeredUser,(err)=>{
//             if(err){
//                 return next(err)
//             }
//             req.flash("success", "Welcome to Airbnb!");
//             res.redirect("/listings");

//         })
        
        
//     } catch (error) {
//         req.flash("error", error.message);
//         res.redirect("/signup");
//     }
// }));


// router.post("/login", (req, res, next) => {
//     passport.authenticate("local", (err, user, info) => {
//         if (err) return next(err);
//         if (!user) {
//             req.flash("error", "Invalid email or password!");
//             return res.redirect("/login");
//         }
//         req.logIn(user, (err) => {
//             if (err) return next(err);
//             req.flash("success", "Welcome back!");
//             console.log("🔄 Redirecting to:", res.locals.redirectUrl || "/listings");  // Debugging

//             let redirectUrl = req.session.redirectUrl || "/listings";
//             delete req.session.redirectUrl; // ✅ Redirect hone ke baad session cleanup
//             return res.redirect(redirectUrl);
//         });
//     })(req, res, next);
// });

  
// router.get("/login",saveRedirectUrl,(req,res)=>{
//     res.render("users/login")
// })
// router.get("/logout",(req,res,next)=>{
//     req.logOut((err)=>{
//         if(err){
//             next(err)
//         }
//         req.flash("success", "You have logged out successfully!");
//         res.redirect("/listings")
//     })
// })

// module.exports = router;

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { saveRedirectUrl } = require("../Middleware");

// router.get("/signup", authController.renderSignup);
// router.post("/signup", authController.signup);
// router.get("/login", saveRedirectUrl, authController.renderLogin);
// router.post("/login", authController.login);
// router.get("/logout", authController.logout);

router.route("/signup")
  .get(authController.renderSignup)
  .post(authController.signup);

router.route("/login")
  .get(saveRedirectUrl, authController.renderLogin)
  .post(authController.login);

router.get("/logout", authController.logout);

module.exports = router;
module.exports = router;