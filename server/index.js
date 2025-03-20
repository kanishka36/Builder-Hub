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
import md5 from "md5";
import { userRoutes } from "./routes/user.routes.js";
import { Server } from "socket.io";
import { createServer } from "http";
import Chat from "./model/chat.model.js";
import { reviewRoutes } from "./routes/review.routes.js";
import { productRoutes } from "./routes/product.routes.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Allow frontend connection
    credentials: true,
  },
});

// Store connected users (key: userId, value: socketId)
const users = {};

io.on("connection", (socket) => {
  // console.log("✅ A user connected:", socket.id);

  // When a user joins, store their userId and socketId
  socket.on("join", async ({ userId, receiverId }) => {
    users[userId] = socket.id;
    // console.log(`User ${userId} connected with socket ID ${socket.id}`);
    // console.log(`Receiver ${receiverId} connected with socket ID ${socket.id}`);

    try {
      const chatHistory = await Chat.find({
        $or: [
          { senderId: userId, receiverId: receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
      }).sort({ createdAt: 1 });
      socket.emit("chatHistory", chatHistory);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  });

  // Handle sending messages
  socket.on("sendMessage", async (messageData) => {
    const { senderId, receiverId, message } = messageData;

    // Save message to database
    const newMessage = new Chat({ senderId, receiverId, message });
    await newMessage.save();

    // Find recipient's socket ID
    const receiverSocketId = users[receiverId];

    if (receiverSocketId) {
      // Send message only to the intended recipient
      io.to(receiverSocketId).emit("receiveMessage", messageData);
    } else {
      console.log(`User ${receiverId} is not online.`);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    // console.log("❌ A user disconnected:", socket.id);

    // Remove disconnected user from users object
    Object.keys(users).forEach((userId) => {
      if (users[userId] === socket.id) {
        delete users[userId];
      }
    });
  });
});

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

app.post("/api/generate-hash", (req, res) => {
  const { merchant_id, order_id, amount, currency } = req.body;
  const merchant_secret =
    "MjU2MjQ3ODU0Mzg1NDExMjgxMDMwODM3NjkwNTQ4OTM5NzEwMzI=";

  const hash = md5(
    merchant_id +
      order_id +
      Number(amount).toFixed(2) +
      currency +
      md5(merchant_secret).toUpperCase()
  ).toUpperCase();

  res.json({ hash });
});

//routes
app.use("/api", authUserRoutes);
app.use("/api", authSellerRoutes);
app.use("/api", authAdminRoutes);
app.use("/api", serviceRoutes);
app.use("/api", roleRoutes);
app.use("/api", sellerRoutes);
app.use("/api", bookingRoutes);
app.use("/api", userRoutes);
app.use("/api", reviewRoutes)
app.use("/api", productRoutes)

app.get("/", (req, res) => {
  res.send("Hello Kanishka");
});

// Start Server
const PORT = process.env.HOST_PORT || 5000;

server.listen(PORT, async () => {
  await connectDB();
  console.log(`✅ Server is running on port ${PORT}`);
});
