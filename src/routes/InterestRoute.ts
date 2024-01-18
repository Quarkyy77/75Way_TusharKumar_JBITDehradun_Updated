import express from "express";
import { isAuthenticated } from "../middlewares";
import { createInterest } from "../controllers/users";

const router = express.Router();

export default router;