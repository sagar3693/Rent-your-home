const mongoose = require("mongoose");
const Reviewc = require("./reviews"); 

const Schema = mongoose.Schema; // Correct casing for 'Schema'

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },// we added url and filename to the image object.
    price: Number,
    location: String,
    country: String,

    // adding reviews array :
    reviews: [
        {
            type: Schema.Types.ObjectId, // Correct property name
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,// owner should prensent in the user collection. (in our database)
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing.reviews.length) {
        const res = await Reviewc.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema); 

module.exports = Listing;
