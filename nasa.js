import express from "express";
import { fetchCurrentLocation } from "../controllers/nasaController.js";

const router = express.Router();

// Current location NASA data
router.get("/current", fetchCurrentLocation);

export default router;
