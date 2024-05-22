// refer joi.dev documentation

const joi = require('joi');

// This is server side validation Schema. (not mongoose schema)
const listingSchema = joi.object({// we want to validate listingSchema (you can get different name)
 
    listobj : joi.object({
        title: joi.string().required(),
        description : joi.string().required(),
        location : joi.string().required(),
        country: joi.string().required(),
        price : joi.number().required().min(0),
        image : joi.string().allow("",null)// it is not required means cumpolsory, we allowed to to be empty or null value.
    }).required()
    // listingSchema must be present listobj object with properties title, description ...

});

// console.log(listingSchema);

module.exports = listingSchema;
 