const express = require("express");
const router = express.Router({ mergeParams: true});// 

const reviewController = require("../controllers/reviews.js");// require the controller.

const expressError = require("../utils/expressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Reviewc = require("../models/reviews.js");
const reviewSchema = require("../reviewSchema.js");
const listing = require("../models/listings.js");
const { isLoggedIn,isReviewAuthor } = require("../middleware.js");

// validate review function
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body); 

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
}


// reviews routes
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

// delete Review route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;