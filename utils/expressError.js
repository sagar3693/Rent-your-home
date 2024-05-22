class expressError extends Error{
    constructor(statusCode,message){
        super();// calling to superclass cunstructor
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = expressError;