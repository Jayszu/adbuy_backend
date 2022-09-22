const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/UserModel");


exports.isAuthenticatedUser = catchAsyncErrors(async (req,res,next) =>{
    const { token } = req.cookies;

  if (!token) {
    return res.status(500).json({
    success:false,
message:"Please login"
})
  }

  const decodedData = jwt.verify(token, process.env.secret);

  req.user = await User.findById(decodedData.id);

  next();
});

// Admin Roles
exports.authorizeRoles = (...roles) =>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return res.status(500).json({
                success:false,
            message:`${req.user.role} is not authorized`
            })
        };
        next();
    }
}