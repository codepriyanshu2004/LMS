import Router from "express";
import { createCourse, getAllCourses, getLecturesByCourseId, removeCourse, updateCourse } from "../controllers/course.controller.js";
import { authorizedRoles, isLoggedIn } from "../middleware/jwtAuth.middleware.js";
import upload from "../middleware/multer.middlware.js";

const router = Router();

router.get("/",getAllCourses);
router.post("/", isLoggedIn, authorizedRoles("ADMIN"), upload.single("thumbnail"),createCourse);
router.put("/:id", isLoggedIn, isLoggedIn, authorizedRoles("ADMIN"), updateCourse);
router.delete("/:id",isLoggedIn, isLoggedIn, authorizedRoles("ADMIN"), removeCourse);

router.get("/:id",isLoggedIn, getLecturesByCourseId);

export default router;