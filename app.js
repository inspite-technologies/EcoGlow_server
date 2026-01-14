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
    'http://localhost:5173' ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Serve uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello world !");
});

app.use("/about-us", aboutUsRoutes);
app.use("/services", servicesRoutes);
app.use("/services/commercial",commercialRoutes)
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
app.use("/contact",contactRoutes)
app.use("/bookings",bookingRoutes)
app.use("/footer",footerRoutes)
app.use("/header",headerRoutes)


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

connectDB();
