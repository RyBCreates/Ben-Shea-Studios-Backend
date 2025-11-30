const dotenv = require("dotenv");

const envFile = process.env.NODE_ENV === "development" ? ".env.local" : ".env";
dotenv.config({ path: envFile });

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("Using DB:", process.env.MONGODB_URI);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
// const errorHandler = require("./middlewares/errorHandler");
// const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

const PORT = process.env.PORT;

// app.use(requestLogger);

app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : "https://ben-shea-studios.vercel.app",
    credentials: true,
  })
);
app.use("/", mainRouter);

// app.use(errorLogger);

// app.use(errors());
// app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Hello, from Port: ${PORT}`);
});

module.exports = app;
