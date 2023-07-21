import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import generateToken from "../utils/genJWT.js";

export const registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }

    let user = await User.findOne({ email });

    if (user) {
        return next(new ErrorHandler("User already exists", 400));
    }

    user = await User.create({
        name,
        email,
        password,
    });

    generateToken(res, user._id);

    res.status(201).json({
        success: true,
        user,
        message: "User created successfully",
    });
});

export const loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Email or Password is incorrect", 404));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorHandler("Email or Password is incorrect", 404));
    }

    generateToken(res, user._id);

    res.status(201).json({
        success: true,
        user,
        message: `${user.name} Welcome back !`,
    });
});

export const logoutUser = catchAsyncError(async (req, res, next) => {
    const options = {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: false,
        sameSite: "strict",
    };

    res.status(200).cookie("token", null, options).json({
        success: true,
        message: "Logout successfully",
    });
});

export const getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        user,
    });
});

export const updateUserProfile = catchAsyncError(async (req, res, next) => {
    const { name, email } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
    });
});

export const changePassword = catchAsyncError(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.matchPassword(oldPassword);

    if (!isMatch) {
        return next(new ErrorHandler("Old Password is incorrect", 400));
    }

    user.password = newPassword;

    user.save();

    res.status(200).json({
        success: true,
        message: "Password Updated Successfully",
    });
});
