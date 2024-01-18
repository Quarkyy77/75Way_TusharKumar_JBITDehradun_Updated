import express from "express";
import { isAuthenticated } from "../middlewares";
import { createJobCategory, getAllJobCategories } from "../controllers/jobCategories";

const router = express.Router();

router.get("/allJobCategories", getAllJobCategories)
router.post("/createJobCategory", isAuthenticated, createJobCategory)

export default router;