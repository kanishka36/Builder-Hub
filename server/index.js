import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.config.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { authUserRoutes } from "./routes/auth/user.auth.routes.js";
import { serviceRoutes } from "./routes/service.routes.js";
import { authSellerRoutes } from "./routes/auth/seller.auth.routes.js";
import { authAdminRoutes } from "./routes/auth/admin.auth.routes.js";
import { roleRoutes } from "./routes/role.routes.js";
import { sellerRoutes } from "./routes/seller.routes.js";
import { bookingRoutes } from "./routes/booking.routes.js";

dotenv.config();

const app = express();

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const prodOrigins = [process.env.ORIGIN_1, process.env.ORIGIN_2];
const devOrigins = ["http://localhost:5173"];
const allowedOrigins =
  process.env.NODE_ENV === "production" ? prodOrigins : devOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

//routes
app.use("/api", authUserRoutes);
app.use("/api", authSellerRoutes);
app.use("/api", authAdminRoutes);
app.use("/api", serviceRoutes);
app.use("/api", roleRoutes);
app.use("/api", sellerRoutes);
app.use("/api", bookingRoutes);

app.get("/", (req, res) => {
  res.send("Hello Kanishka");
});

const PORT = process.env.HOST_PORT || 5000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`✅ Server is running on port ${PORT}`);
});
