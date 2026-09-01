import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getAdminProfile,
  getAdminProperties,
  getDashboardController
} from "../controllers/adminController.js";
const router = express.Router();

router.get(
  "/profile",
  authMiddleware,
  getAdminProfile
);

router.get(
  "/properties",
  authMiddleware,
  getAdminProperties
);
router.get(
  "/dashboard",
  authMiddleware,
  getDashboardController
);
export default router;