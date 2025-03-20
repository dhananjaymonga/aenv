const User = require("../modules/user");
const wrapAsync = require("../utils/WrapAsync");
const passport = require("passport");

module.exports = {
  renderSignup: (req, res) => {
    res.render("users/signup");
  },
  signup: wrapAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        req.flash("error", "All fields are required!");
        return res.redirect("/signup");
      }
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      req.logIn(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Airbnb!");
        res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  }),

  renderLogin: (req, res) => {
    res.render("users/login");
  },

  login: (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        req.flash("error", "Invalid email or password!");
        return res.redirect("/login");
      }
  
      req.logIn(user, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome back!");
  
        let redirectUrl = req.session.redirectUrl || "/listings";
        if (redirectUrl === "/login") redirectUrl = "/listings"; // ✅ Fix loop issue
  
        delete req.session.redirectUrl; // ✅ Clear after login
        console.log("✅ Redirecting to:", redirectUrl);
        return res.redirect(redirectUrl);
      });
    })(req, res, next);
  },
  

  logout: (req, res, next) => {
    req.logOut((err) => {
      if (err) return next(err);
      req.flash("success", "You have logged out successfully!");
      res.redirect("/listings");
    });
  },
  googleRedirect: (req, res) => {
    if (!req.user) {
      req.flash("error", "Authentication failed!");
      return res.redirect("/login");
    }
  
    req.flash("success", "Logged in successfully via Google!");
  
    let redirectUrl = req.session.redirectUrl || "/listings";
    
    // 🔥 Google Auth Redirect Fix: Agar invalid URL hai toh default do
    if (redirectUrl.includes("/auth/google")) {
      redirectUrl = "/listings";
    }
  
    delete req.session.redirectUrl;
    console.log("✅ Google Redirecting to:", redirectUrl);
    res.redirect(redirectUrl);
  },
  
  
  
  
};