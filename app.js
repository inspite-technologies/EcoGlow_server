import express from "express";
import "dotenv/config";
import connectDB from "./config/connection.js";
import aboutUsRoutes from "./routes/aboutUsRoutes.js";
import servicesRoutes from "./routes/servicesRoutes.js";
import packagesRoutes from "./routes/packagesRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";
import homeAboutRoutes from "./routes/HomeAboutRoutes.js";
import homeServicesRoutes from "./routes/servicesHomeRoutes.js";
import bannerRoutes from "./routes/homeBannerRoutes.js";
import advantagesRoutes from "./routes/advantagesRoutes.js";
import messageRouters from "./routes/messageRoutes.js";
import contactRoutes from "./routes/contactRoutes.js"
import homeRoutes from './routes/homeRoutes.js'
import adminRoutes from "./routes/adminRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js"
import footerRoutes from "./routes/footerRouter.js"
import commercialRoutes from "./routes/commercialRoutes.js"
import headerRoutes from "./routes/headerRoutes.js"
import cors from "cors";
import path from "path";

const app = express();

const corsOptions = {
  origin: [
    'https://ecoglow.ae', 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

//  Serve uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello world !");
});

app.use("/about-us", aboutUsRoutes);
app.use("/services", servicesRoutes);
app.use("/services/commercial", commercialRoutes)
app.use("/packages", packagesRoutes);
app.use("/faq", faqRoutes);
app.use("/hero", heroRoutes);
app.use("/home-about", homeAboutRoutes);
app.use("/home-services", homeServicesRoutes);
app.use("/banner", bannerRoutes);
app.use("/advantages", advantagesRoutes);
app.use("/message", messageRouters);
app.use("/home-content", homeRoutes);
app.use("/admin", adminRoutes);
app.use("/contact", contactRoutes)
app.use("/bookings", bookingRoutes)
app.use("/footer", footerRoutes)
app.use("/header", headerRoutes)

// Global Error Handler - Place AFTER all routes
app.use((err, req, res, next) => {
  console.error("❌ Global Error Handler Caught:", err);

  // Handle Multer Errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 50MB.',
        error: err.message
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded.',
        error: err.message
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.',
        error: err.message
      });
    }
  }

  // Handle custom file filter errors
  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: err.message,
      error: 'Invalid file type'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

connectDB();
