const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your Name"],
    minlength: [3, "Please enter a name atleast 3 characters"],
    maxlength: [15, "Name can not big than 15 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    validate: [validator.isEmail, "Please enter a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password!"],
    minlength: [4, "Password should be greater than 4 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
     
    },
    url: {
      type: String,
      
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
});

// Hash pass / security

userSchema.pre('save',async function(next){
  if(!this.isModified("password")){
    next();
  }
    this.password = await bcrypt.hash(this.password,10);

});

//jwt

userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id}, process.env.secret,{
        expiresIn:process.env.jwt_expire
    })
};
//compare pass auth
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  //forgot pass

  userSchema.methods.getResetToken = function(){
    //generate token for reset
    const resetToken = crypto.randomBytes(20).toString("hex");

      this.resetPasswordToken = crypto.createHash("sha256").update(resetToken)
      .digest('hex');

      this.resetPasswordTime= Date.now() + 15 *60 *1000;

      return resetToken
    }

module.exports = mongoose.model("User", userSchema)