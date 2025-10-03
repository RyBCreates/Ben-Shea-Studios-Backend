require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const stripe = require("stripe");
// const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
// const errorHandler = require("./middlewares/errorHandler");
// const { loginUser, createUser } = require("./controllers/users");
// const { requestLogger, errorLogger } = require("./middlewares/logger");
// const {
//   validateUserSignup,
//   validateUserLogin,
// } = require("./middlewares/validation");

const app = express();

const { PORT = 4000 } = process.env;

// app.use(stripe("sk_test_your_secret_key_here"));

// app.use(requestLogger);

app.use(express.json());
app.use(cors());

// app.get("/crash-test", () => {
//   setTimeout(() => {
//     throw new Error("Server will crash now");
//   }, 0);
// });

// app.post("/signup", validateUserSignup, createUser);
// app.post("/signin", validateUserLogin, loginUser);

app.use("/", mainRouter);

// app.use(errorLogger);

// app.use(errors());
// app.use(errorHandler);

mongoose.connect("mongodb://127.0.0.1:27017/ben-shea-studios_db");

app.listen(PORT, () => {
  console.log(`Hello, from Port: ${PORT}`);
});

module.exports = app;
