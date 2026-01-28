import Router from "express";
import { createCourse, getAllCourses, getLecturesByCourseId, removeCourse, updateCourse } from "../controllers/course.controller.js";
import { isLoggedIn } from "../middleware/jwtAuth.middleware.js";
import upload from "../middleware/multer.middlware.js";

const router = Router();

router.get("/",getAllCourses);
router.post("/", upload.single("thumbnail"),createCourse);
router.put("/:id",updateCourse);
router.delete("/:id",removeCourse);

router.get("/:id",isLoggedIn, getLecturesByCourseId);

export default router;