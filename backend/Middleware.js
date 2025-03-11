// module.exports. isLoggedIn=(req,res,next)=>{
//     // console.log(req.user)

// if(!req.isAuthenticated()){
//     req.flash("error","you must be logged  in to create listing ")
//      return res.redirect("/login")
//         }
//         next()
//     }
    module.exports.isLoggedIn = (req, res, next) => {
        console.log("Current User Session:", req.user); // ✅ Debugging ke liye
        if (!req.isAuthenticated()) {
            req.session.redirectUrl=req.originalUrl
            req.flash("error", "You must be logged in to access this page!");
            return res.redirect("/login");
        }
        next();
    };
    module.exports.saveRedirectUrl = (req, res, next) => {
        if (req.session.redirectUrl) {
            res.locals.redirectUrl = req.session.redirectUrl;
        }
        next();
    };
    