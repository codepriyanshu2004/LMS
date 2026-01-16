import { Router } from "express";
import { getProfile, login, logout, register } from "../controllers/user.controller.js";
import { isLoggedIn } from "../model/jwtAuth.middleware.js";

const router = Router();

router.post("/register",register);
router.post("/login",login);
router.get("/logout",isLoggedIn,logout);
router.get("/me",isLoggedIn, getProfile);


export default router;