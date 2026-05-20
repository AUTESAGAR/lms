import express from "express";
import upload from "../middleware/fileHandler.js";
import { addCourse, addCourseContent, learnCourse, addCourseContentSubmit, addCourseSubmit, deleteCourse, deleteCourseContent, editCourse, editCourseContent, editCourseContentSubmit, editCourseSubmit, myCourses, viewCourse } from "../controller/course.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/add-course",authMiddleware,roleMiddleware("admin"),addCourse);
router.post("/add-course",authMiddleware,roleMiddleware("admin"),upload.single("thumbnail"),addCourseSubmit);
router.get("/edit-course/:id",authMiddleware,roleMiddleware("admin"),editCourse);
router.post("/edit-course/:id",authMiddleware,roleMiddleware("admin"),upload.single("thumbnail"),editCourseSubmit);
router.get("/delete-course/:id",authMiddleware,roleMiddleware("admin"),deleteCourse);
router.get("/view-course/:id",authMiddleware,roleMiddleware("user"),viewCourse);
router.get("/add-course-content/:id",authMiddleware,roleMiddleware("admin"),addCourseContent);
router.post("/add-course-content",authMiddleware,roleMiddleware("admin"),addCourseContentSubmit);
router.get("/edit-course-content/:id",authMiddleware,roleMiddleware("admin"),editCourseContent);
router.post("/edit-course-content",authMiddleware,roleMiddleware("admin"),editCourseContentSubmit);
router.get("/delete-course-content/:id",authMiddleware,roleMiddleware("admin"),deleteCourseContent);

router.get("/my-courses",authMiddleware,roleMiddleware("user"),myCourses);
router.get("/learn-course/:id",authMiddleware,roleMiddleware("user"),learnCourse);


export default router;
