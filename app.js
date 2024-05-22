// use of mongo session : (get reference from npm connect-mongo)

if(process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose"); 
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverrid = require("method-override");
const expressError = require("./utils/expressError.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');// requiring connect-mongo

const flash = require("connect-flash");

const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverrid("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const dbUrl = process.env.ATLASDB_URL;

// setting up the mongo session options.
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret : process.env.SECRET
    },
    touchAfter: 24 * 3600
})

store.on("error",()=>{
    console.log("Error in mongo session store", err);
})

// setting up the session options.
const sessionOptions = {
    store,// adding store
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000
    }
};


app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const listingsRouter = require("./routes/listings.js");

const reviewsRouter = require("./routes/reviews.js");

const userRouter = require("./routes/user.js");

main().then((res) => {
    console.log("databse connection successful ...");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

// middleware to define local variables. 
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.all("*", (req, res, next) => {
    next(new expressError(404, "page not found !"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong !" } = err;
    res.status(statusCode).render("error.ejs", { err });
})

app.listen(8080, () => {
    console.log("your server is started on port 8080");
})

// now your session information will store fon mongo atlas you can see on mongo atlas