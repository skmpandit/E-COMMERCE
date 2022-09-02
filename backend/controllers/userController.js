const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sentToken = require("../utils/jwtToken");
const sendEmail = require("../middleware/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register a new user

exports.registerUser = catchAsyncError(async(req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    })
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    })
    sentToken(user,201,res);
})


// Login User

exports.loginUser = catchAsyncError( async(req, res, next) => {
    const { email, password } = req.body;

    // checking if user has given email and pasword both 
    if(!email || !password) {
        return next(new ErrorHander("Please provide email and password", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if(!user) {
        return next(new ErrorHander("Invalid email and password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched) {
        return next(new ErrorHander("Invalid email and password", 401))
    }

    sentToken(user, 200, res);
});

exports.logout = catchAsyncError( async(req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "You are Logged Successfully"
    })
})


// Forgot Passsword

exports.forgotPassword = catchAsyncError( async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        return next(new ErrorHander("No user found with this email", 404));
    }
    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    // Create reset url 
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    // Create message to send the user
    const message = `Your password seset token is :- \n\n${resetPasswordUrl} \n\nIf you didn't request this, please ignore this email!`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery:- Your password reset token (valid for 10 minutes)",
            message,
        })
        res.status(200).json({
            success: true,
            message: `Email has been sent to ${user.email} successfully`,
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHander(error.message, 500));
    }
})

// Reset Password
exports.resetPassword = catchAsyncError( async(req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpires: { $gt: Date.now()},})
    if(!user) {
        return next(new ErrorHander("Reset Password Token is invalid or has been expired", 400));
    }
    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHander("Password and Confirm Password are not matched", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sentToken(user, 200, res);
})

// Get User Details 

exports.getUserDetails = catchAsyncError( async(req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    })
})

// Update User Passsowrd
exports.updatePassword = catchAsyncError( async(req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched) {
        return next(new ErrorHander("Old Password is incorrect", 400));
    }
    if(req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHander("New Password and Confirm Password are not matched", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sentToken(user, 200, res);
})

// Upate User Profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
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
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });
  });


// Get all users (admin)
exports.getAllUser = catchAsyncError( async(req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
    })
})

// Get single user (admin) 

exports.getSingleUser = catchAsyncError( async(req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user) {
        return next(new ErrorHander(`User does not exist with id: ${req.params.id}`));
    }
    res.status(200).json({
        success: true,
        user,
    })
})

// Update Role User -- Admin
exports.updateUserRole = catchAsyncError( async(req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: false,
    });
    res.status(200).json({
        success: true,
    });
});

// Delete User --- Admin

exports.deleteUser = catchAsyncError(async (req, body, next) => {
    const user  = await User.findById(req.params.id);
    if(!user) {
        return next(new ErrorHander(`User does not exist with id: ${req.params.id}`,400));
    }

    //cloudinary is not added we will add it leter
    await user.remove();
    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    })
})