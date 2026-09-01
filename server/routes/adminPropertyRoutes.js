import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getAdminProperties,
  getAdminProperty
} from "../controllers/adminController.js";

import {
  updatePropertyStatusController
} from "../controllers/propertyController.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getAdminProperties
);

router.get(
  "/:id",
  authMiddleware,
  getAdminProperty
);

router.patch(
  "/:id/status",
  authMiddleware,
  updatePropertyStatusController
);

export default router;