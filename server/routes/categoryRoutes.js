import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createCategoryController,
  getCategoriesController,
  getCategoryController,
  getCategoryBySlugController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();


/*
=========================================
PUBLIC
=========================================
*/

// Get active categories
router.get(
  "/",
  getCategoriesController
);

// Get category by slug
router.get(
  "/slug/:slug",
  getCategoryBySlugController
);

// Get single category
router.get(
  "/:id",
  getCategoryController
);


/*
=========================================
ADMIN
=========================================
*/

// Create category
router.post(
  "/",
  authMiddleware,
  createCategoryController
);

// Update category
router.put(
  "/:id",
  authMiddleware,
  updateCategoryController
);

// Delete category
router.delete(
  "/:id",
  authMiddleware,
  deleteCategoryController
);

export default router;