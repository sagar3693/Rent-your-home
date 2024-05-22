// get reference of sag42_schema.js
const joi = require('joi');

const reviewSchema = joi.object({
    Review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required()
    }).required()
})

module.exports = reviewSchema;