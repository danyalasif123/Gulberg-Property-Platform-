import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createLocationController,
  getLocationsController,
  getLocationController,
  getLocationBySlugController,
  updateLocationController,
  deleteLocationController,
} from "../controllers/locationController.js";

const router = express.Router();


/*
=========================================
PUBLIC
=========================================
*/

// Get active locations
router.get(
  "/",
  getLocationsController
);

// Get by slug
router.get(
  "/slug/:slug",
  getLocationBySlugController
);

// Get single location
router.get(
  "/:id",
  getLocationController
);


/*
=========================================
ADMIN
=========================================
*/

// Create
router.post(
  "/",
  authMiddleware,
  createLocationController
);

// Update
router.put(
  "/:id",
  authMiddleware,
  updateLocationController
);

// Delete
router.delete(
  "/:id",
  authMiddleware,
  deleteLocationController
);

export default router;