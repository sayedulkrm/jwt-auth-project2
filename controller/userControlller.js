import { catchAsyncError } from "../middlewares/catchAsyncError";
import { User } from "../models/User";
import ErrorHandler from "../utils/errorHandler";

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
});
