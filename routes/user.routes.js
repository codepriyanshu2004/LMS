import { Router } from "express";
import { changePassword, forgotPassword, getProfile, login, logout, register, resetPassword, updateUser } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middleware/jwtAuth.middleware.js";
import upload from "../middleware/multer.middlware.js";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login",login);
router.get("/logout",isLoggedIn,logout);
router.get("/me",isLoggedIn, getProfile);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:resetToken",resetPassword);
router.post("/change-password",isLoggedIn,changePassword);
router.put("/update", isLoggedIn, upload.single("avatar"), updateUser)



export default router;