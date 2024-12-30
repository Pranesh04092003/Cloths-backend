const express = require("express");//hello
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/database");
const requestLogger = require("./middleware/requestLogger");
const responseLogger = require("./middleware/responseLogger");
const shopRoutes = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const addressRoutes = require("./routes/address");
const morgan = require('morgan');
const { body } = require('express-validator');

require('dotenv').config();

(async () => {
  const chalk = (await import("chalk")).default;

  // Connect to database
  await connectDB();


  const app = express();
  const server = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

  // Initialize Socket.IO with all origins allowed
  const io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  });

  // Socket.IO connection handling
  io.on("connection", (socket) => {
    console.log(chalk.blue("Client connected"));

    socket.on("disconnect", () => {
      console.log(chalk.yellow("Client disconnected"));
    });
  });

  // Make io accessible to routes
  app.set("io", io);

  // Essential middleware
  app.use(express.json());
  // Configure CORS for Express
  app.use(
    cors({
      origin: "*", // Allow all origins
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    })
  );
  app.use(requestLogger);
  app.use(responseLogger);

  // Routes
  app.use("/api/shop/auth", authRoutes);
  app.use("/api/shop", shopRoutes);
  app.use("/api/admin", adminRoutes);

  app.use("/api/addresses", addressRoutes);

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(chalk.red(err.stack));
    res.status(500).json({ error: "Something went wrong!" });
  });

  // Start server
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(chalk.magentaBright(`Server running on port ${PORT}`));
  });
})();
