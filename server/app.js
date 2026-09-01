import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import adminPropertyRoutes from "./routes/adminPropertyRoutes.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import testCloudinaryRoutes from "./routes/testCloudinaryRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
const app = express();

// -------------------------
// Global Middleware
// -------------------------

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

// -------------------------
// Health Check
// -------------------------

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Gulberg Property Platform API is running"
  });
});

// -------------------------
// API Routes
// -------------------------

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/properties", propertyRoutes);

app.use("/api/enquiries", enquiryRoutes);
app.use("/api/admin/properties",adminPropertyRoutes);
app.use("/api/uploads",uploadRoutes);
app.use("/api/categories",categoryRoutes);

app.use(
  "/api/locations",
  locationRoutes
);
// -------------------------
// 404
// -------------------------
app.use(
  "/api/test",
  testCloudinaryRoutes
);

app.use(notFoundMiddleware);

// -------------------------
// Error Handler
// -------------------------

app.use(errorMiddleware);

export default app;