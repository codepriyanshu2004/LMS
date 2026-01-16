import { Router } from "express";
import { getProfile, login, logout, register } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middleware/jwtAuth.middleware.js";
import upload from "../middleware/multer.middlware.js";

const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login",login);
router.get("/logout",isLoggedIn,logout);
router.get("/me",isLoggedIn, getProfile);


export default router;