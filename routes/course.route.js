import Router from "express";
import { getAllCourses, getLecturesByCourseId } from "../controllers/course.controller.js";
import { isLoggedIn } from "../middleware/jwtAuth.middleware.js";

const router = Router();

router.get("/",getAllCourses);

router.get("/:id",isLoggedIn, getLecturesByCourseId);

export default router;