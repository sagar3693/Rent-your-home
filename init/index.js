const mongoose = require("mongoose");
const initData = require("./data.js");
// console.log(data);

const listing = require("../models/listings.js");
// console.log(listing);

const mongo_url = 'mongodb://127.0.0.1:27017/wanderlust3';

main().then((res)=>{
    console.log("databse connection successful ...");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongo_url);
}

const initDB = async () =>{
    await listing.deleteMany({});
    // adding owner property using map function. (within each object)
    initData.data = initData.data.map((obj)=>({...obj, owner : "65e43635a92f9e3124a0b361"}));// this is the id of sagar user (password : jadhav).
    // remember initData.data is an array of objects.
    await listing.insertMany(initData.data);
    console.log("data was initialized ...");
}

initDB();