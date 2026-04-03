require("dotenv").config();
const express = require("express");
const { router: authRoutes } = require("./routes/auth.routes");
const { router: userRoutes } = require("./routes/user.routes");
const { router: transactionRoutes } = require("./routes/transaction.routes");
const { router: dashboardRoutes } = require("./routes/dashboard.routes");
const prisma = require("./config/prisma");
const requestLogger = require("./middleware/logger");
const errorHandler = require("./utils/errorHandler");

const app = express();

// Parse incoming JSON bodies; cap at 10 kb to guard against oversized payloads
app.use(express.json({ limit: "10kb" }));
app.use(requestLogger);

// Lightweight liveness probe no auth no DB hit
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Catch-all error handler must come after all routes
app.use(errorHandler);

const PORT = parseInt(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("[DB] Connected to PostgreSQL via Prisma");

    app.listen(PORT, () => {
      console.log(`[SERVER] Running on port ${PORT}`);
    });
  } catch (error) {
    console.error("[DB] Connection failed:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
