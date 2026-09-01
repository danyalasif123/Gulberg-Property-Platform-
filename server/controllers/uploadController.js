import { uploadImage } from "../services/uploadService.js";

export const uploadPropertyImages = async (
  req,
  res
) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one image"
      });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const image = await uploadImage(
        file.buffer
      );

      uploadedImages.push(image);
    }

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      images: uploadedImages
    });
  } catch (error) {
    console.error(
      "Image upload error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to upload images"
    });
  }
};