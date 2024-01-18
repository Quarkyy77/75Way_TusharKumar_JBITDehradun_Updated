import express from "express";
import { applyOnJobByJobId } from "../controllers/app";
import {isAuthenticated} from "../middlewares"

const router = express.Router();

router.post("/:id", isAuthenticated, applyOnJobByJobId);

export default router;