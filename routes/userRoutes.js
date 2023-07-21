import express from "express";
import {
    changePassword,
    getUserProfile,
    loginUser,
    logoutUser,
    registerUser,
    updateUserProfile,
} from "../controller/userControlller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/logout").get(isAuthenticated, logoutUser);

router
    .route("/me")
    .get(isAuthenticated, getUserProfile)
    .put(isAuthenticated, updateUserProfile);

router.route("/changePassword").put(isAuthenticated, changePassword);

export default router;
