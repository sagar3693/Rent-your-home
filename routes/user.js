// automatic login after signup
const express = require('express');
const router = express.Router({ mergeParams: true});
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const {saveRedirectUrl} = require("../middleware.js");// requiring saveRedirectUrl is a middleware function.

const userController = require("../controllers/user.js");
const user = require('../models/user.js');

router.get("/signup", userController.renderSignup);

router.post("/signup", wrapAsync(userController.signup));

// sign in
router.get("/login", userController.renderLogin);

// redirect to original url after login.
router.post("/login",saveRedirectUrl,passport.authenticate("local", {failureRedirect:"/login", failureFlash:true}), userController.login);

router.get("/logout", userController.logout);
    
module.exports = router;
// for testing purpose.