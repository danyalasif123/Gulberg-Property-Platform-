import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    console.log("Environment check:", {
      cloudName: Boolean(
        process.env.CLOUDINARY_CLOUD_NAME
      ),
      apiKey: Boolean(
        process.env.CLOUDINARY_API_KEY
      ),
      apiSecret: Boolean(
        process.env.CLOUDINARY_API_SECRET
      )
    });

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Server failed to start:",
      error.message
    );

    process.exit(1);
  }
};

startServer();