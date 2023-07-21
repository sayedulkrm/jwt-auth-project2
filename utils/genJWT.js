import jwt from "jsonwebtoken";

const generateToken = (res, userID) => {
    const token = jwt.sign({ userID }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export default generateToken;
