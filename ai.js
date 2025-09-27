import express from "express";
import multer from "multer";
import { processImage } from "../controllers/aiController.js";

const router = express.Router();
const upload = multer({ dest: "ai/uploads/" });

router.post("/chat", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const question = req.body.question || "";
    const result = await processImage(req.file, question);

    res.json({ status: "success", ...result });
  } catch (err) {
    console.error("Error in /ai/chat:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
