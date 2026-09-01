import express from "express";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.get("/cloudinary", async (req, res) => {
  try {
    const config = {
      cloudName: Boolean(
        process.env.CLOUDINARY_CLOUD_NAME
      ),
      apiKey: Boolean(
        process.env.CLOUDINARY_API_KEY
      ),
      apiSecret: Boolean(
        process.env.CLOUDINARY_API_SECRET
      )
    };

    console.log("Cloudinary environment:", config);

    if (
      !config.cloudName ||
      !config.apiKey ||
      !config.apiSecret
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Cloudinary environment variables are missing",
        config
      });
    }

    // Test Cloudinary connection
    const result =
      await cloudinary.api.resources({
        resource_type: "image",
        max_results: 1
      });

    res.status(200).json({
      success: true,
      message: "Cloudinary connection successful",
      cloudName:
        process.env.CLOUDINARY_CLOUD_NAME,
      resourcesFound:
        result.resources.length
    });
  } catch (error) {
    console.error(
      "Cloudinary test error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Cloudinary connection failed",
      error: error.message
    });
  }
});

export default router;