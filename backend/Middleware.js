// module.exports. isLoggedIn=(req,res,next)=>{
//     // console.log(req.user)

// if(!req.isAuthenticated()){
//     req.flash("error","you must be logged  in to create listing ")
//      return res.redirect("/login")
//         }
//         next()
//     }
const Listing = require("./modules/listing");
const Review = require("./modules/review");
// const ExpressError =require("./utils/ExpressError")

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to edit or delete this listing!");
        return res.redirect(`/listings/${id}`);
    }

    next(); // If owner, continue to the route
};
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

    module.exports.isOwner = async (req, res, next) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
    
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }
    
        if (!listing.owner.equals(req.user._id)) {
            req.flash("error", "You do not have permission to edit or delete this listing!");
            return res.redirect(`/listings/${id}`);
        }
    
        next(); // If owner, continue to the route
    };
    
   
    module.exports.isReviewAuthor = async (req, res, next) => {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId);
    
        if (!review) {
            req.flash("error", "Review not found!");
            return res.redirect("back");
        }
    
        if (!review.author.equals(req.user._id)) {
            req.flash("error", "You do not have permission to delete this review!");
            return res.redirect("back");
        }
    
        next(); // If author, continue to the route
    };
    module.exports.saveRedirectUrl = (req, res, next) => {
        console.log("🔍 Checking session before saving redirect URL:", req.session);
    
        if (req.session.redirectUrl) {
            console.log("✅ Redirect URL Already Exists:", req.session.redirectUrl);
        } else {
            req.session.redirectUrl = req.originalUrl;
            console.log("📝 Saving Redirect URL:", req.session.redirectUrl);
        }
    
        next();
    };