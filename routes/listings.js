const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listings.js"); 
const expressError = require("../utils/expressError.js");
const listingSchema = require("../listingSchema.js");
const listingController = require("../controllers/listings.js");
const {isLoggedIn, isOwner} = require("../middleware.js");

const multer  = require('multer');
const {storage} = require('../cloudconfig.js');
const upload = multer({ storage });// multer will use the storage object to store the images in cloudinary. (multer stores the images in cloudinary.)

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body); 

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400,errMsg);
    }else{
        next();
    }
}

// index route
router.get("/", wrapAsync(listingController.index));

// new route
router.get("/new", isLoggedIn, listingController.renderNewForm); 

// show route
router.get("/:id", wrapAsync(listingController.showListing));

// create route : 
router.post("/", isLoggedIn,upload.single("listobj[image]"),validateListing, wrapAsync(listingController.createListing));

// router.post("/", upload.single("listobj[image]"), (req, res) => {
//     res.send(req.file);
// });// you can see path of uploaded image into req.file object. 


// Edit route : 
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

// update route :
router.put("/:id",isLoggedIn,isOwner,upload.single("listobj[image]"),validateListing, wrapAsync(listingController.updateListing));// we added isOwner here.


router.delete("/:id", isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));// we added isOwner here.

module.exports = router;// export the router object.


