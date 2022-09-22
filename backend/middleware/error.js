const errorHandler = require('errorhandler');
const ErrorHandler = require('../utils/ErrorHandler')

module.exports =(err, req, res, next)=>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Intenal server error"
    
    if(err.name === "CastError"){
        const message =`Resource not found ${err.path}`;
        err=new ErrorHandler(message,400)
    }
   

    res.status(err.statusCode).json({
        success:false,
        error: err.message
    });
}