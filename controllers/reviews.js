const Reviewc = require("../models/reviews.js");
const listing = require("../models/listings.js");

module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    console.log("id is ", id);
    let listData = await listing.findById(id);
    let newReview = new Reviewc(req.body.Review);
    newReview.author = req.user._id;// we are adding the author to the review.

    console.log("new review is ", newReview);

    listData.reviews.push(newReview);

    await newReview.save();
    await listData.save();
    console.log("new review is added ...");
    // flash message :
    req.flash("success","Successfully created a new review !");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Reviewc.findByIdAndDelete(reviewId);
    // flash message :
    req.flash("success","Successfully deleted the review !");
    res.redirect(`/listings/${id}`);
}