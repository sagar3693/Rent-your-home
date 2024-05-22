const listing = require("../models/listings.js");

module.exports.index = async (req, res) => {
    let alllistings = await listing.find({});
    res.render("index.ejs", { alllistings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("form.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listData = await listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("owner");
    if(!listData){
        req.flash("error","listing you requested does not exist !");
        return res.redirect("/listings");
    }
    console.log(listData);
    res.render("show.ejs", { listData });
}

module.exports.createListing = async (req, res, next) => {

    // console.log(req.body);
    // accessing the uploaded image :
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url);
    
    let newlisting = new listing(req.body.listobj);
    console.log(newlisting);
    
    newlisting.owner = req.user._id;
    
    newlisting.image = { url, filename };// we added url and filename to the image object.

    await newlisting.save();
    req.flash("success","Successfully created a new listing !");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listData = await listing.findById(id);
    if(!listData){
        req.flash("error","listing you requested does not exist !");
        return res.redirect("/listings");
    }
    res.render("edit.ejs", { listData });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listData = await listing.findByIdAndUpdate(id, { ...req.body.listobj });

    if(typeof(req.file)!=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listData.image = {url,filename};
        await listData.save();
    }// if req.file has some value then we run this code. and if it is undefined then this if statement will not execute.

    req.flash("success","Successfully updated a listing !");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    console.log("we have deleted list : ", deletedListing);
    req.flash("success","Successfully deleted a listing !");
    res.redirect("/listings");
}