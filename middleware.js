let listing = require("./models/listings");// require listing model.
let Review = require("./models/reviews");// require review model.

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        // get reference from project phase 2 (part - e)
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be signed in !");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let list = await listing.findById(id);// we nee to require listing model.
    if(!list.owner.equals(req.user._id)){
        req.flash("error","You are not the owner of this listing !");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error","You are not the owner of this review !");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

