import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import validationMiddleware from "../middleware/validationMiddleware.js";

import {
  createPropertyValidator
} from "../validators/propertyValidator.js";
import {
  createPropertyController,
  getPropertiesController,
  getPropertyController,
  updatePropertyController,
  deletePropertyController,
  updatePropertyStatusController
} from "../controllers/propertyController.js";
const router = express.Router();

/*
    PUBLIC
*/

// Get all published properties
router.get("/", getPropertiesController);

// Get single property
router.get("/:id", getPropertyController);


/*
    ADMIN
*/

// Create property
router.post(
  "/",
  authMiddleware,
  createPropertyValidator,
  validationMiddleware,
  createPropertyController
);

// Update property
router.put(
  "/:id",
  authMiddleware,
  updatePropertyController
);

// Delete property
router.delete(
  "/:id",
  authMiddleware,
  deletePropertyController
);
router.patch(
  "/:id/status",
  authMiddleware,
  updatePropertyStatusController
);
export default router;