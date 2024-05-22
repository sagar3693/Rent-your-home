// function wrapAsync(fn){
//     return function(req,res,next){
//         fn(req,res,next).catch(next);
//     }
// }

// we are directly exporting above function
module.exports = (fn) => {
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}
