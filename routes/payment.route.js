import {Router} from "express";
import { allPayment, buySubscription, cancelSubscription, getRazorpayApiKey, verifySubscription } from "../controllers/payment.controller.js";
import { authorizedRoles, isLoggedIn } from "../middleware/jwtAuth.middleware.js";

const router = Router();

router.get("/razorpay-key",isLoggedIn, getRazorpayApiKey);

router.post("/subscribe", isLoggedIn, buySubscription);

router.post("/verify",isLoggedIn, verifySubscription);

router.post("/unsubscibe", isLoggedIn, cancelSubscription);

router.get("/",isLoggedIn, authorizedRoles("ADMIN"), allPayment);

export default router;