import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  uploadPropertyImages
} from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/property-images",
  authMiddleware,
  upload.array("images", 10),
  uploadPropertyImages
);

export default router;