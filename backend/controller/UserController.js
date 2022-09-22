const User = require('../model/UserModel')
const catchAsyncError = require('../middleware/catchAsyncErrors')
const ErrorHandler = require ('../utils/ErrorHandler')
const sendToken = require('../utils/jwtToken')
const sendMail = require ('../utils/sendMail')
const crypto = require('crypto')
const cloudinary = require('cloudinary')
//register

exports.createUser = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const token = user.getJwtToken();
    
    sendToken(user, 201, res);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//login

exports.loginUser = catchAsyncError(async(req,res,next)=>{
    const {email,password}= req.body;
    if(!email || !password){
        return res.status(403).json({
            success:false,
        message:"Please enter your Email and Password"}
)};
const user = await User.findOne({ email }).select("+password");

if (!user) {
    return res.status(403).json({
        success:false,
    message:"Wrong Email Or Password"
    })
}
const isPasswordMatched = await user.comparePassword(password);

if (!isPasswordMatched) {
  return res.status(403).json({
    success:false,
message:"Wrong Email Or Password"
})
}

sendToken(user,200,res);
});
//logout
exports.logoutUser = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  
    res.status(200).json({
      success: true,
      message: "Log out success",
    });
  });

  //forgot pass
  exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
        return res.status(404).json({
            success:false,
        message:"No User found with this email"
        })
    }
  
    // Get ResetPassword Token
  
    const resetToken = user.getResetToken();
  
    await user.save({
      validateBeforeSave: false,
    });
  
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
  
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl}`;
  
    try {
      await sendMail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} succesfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTime = undefined;
  
      await user.save({
        validateBeforeSave: false,
      });
  
      return res.status(500).json({
        success:false,
    message:err.message
    })
    }
  });
  //reset pass
  exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // Create Token hash
  
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordTime: { $gt: Date.now() },
    });
  
    if (!user) {
        return res.status(400).json({
            success:false,
        message:"Reset url expired"
        })
    }
  
    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({
            success:false,
        message:"Password does not match"
        })
    }
  
    user.password = req.body.password;
  
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  });
  //userdetails
  exports.userDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    res.status(200).json({
      success: true,
      user,
    });
  });
  //update user pass
  exports.updatePassword = catchAsyncError(async (req, res, next) => {
   
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return res.status(400).json({
            success:false,
        message:"Old password is incorrect"
        })
    };

    if(req.body.newPassword  !== req.body.confirmPassword){
        return res.status(400).json({
            success:false,
        message:"Password does not match"
        })
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res);
});
//update profile
exports.updateProfile = catchAsyncError(async(req,res,next) =>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

   if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidator: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});
//get all user -- admin
exports.getAllUsers = catchAsyncError(async (req,res,next) =>{
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});
// Get Single User Details ---Admin
exports.getSingleUser = catchAsyncError(async (req,res,next) =>{
    const user = await User.findById(req.params.id);
   
    if(!user){
        return res.status(400).json({
            success:false,
        message:" user not found"
        })
    }

    res.status(200).json({
        success: true,
        user,
    });
});
// Change user Role --Admin
exports.updateUserRole = catchAsyncError(async(req,res,next) =>{
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };
    const user = await User.findByIdAndUpdate(req.params.id,newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user
    })
});




 
