import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createEnquiryController,
  getEnquiriesController,
  getEnquiryController,
  updateEnquiryController,
  deleteEnquiryController
} from "../controllers/enquiryController.js";

const router = express.Router();

/*
 * PUBLIC
 */

router.post(
  "/",
  createEnquiryController
);

/*
 * ADMIN
 */

router.get(
  "/",
  authMiddleware,
  getEnquiriesController
);

router.get(
  "/:id",
  authMiddleware,
  getEnquiryController
);

router.put(
  "/:id",
  authMiddleware,
  updateEnquiryController
);

router.delete(
  "/:id",
  authMiddleware,
  deleteEnquiryController
);

export default router;