require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
// const errorHandler = require("./middlewares/errorHandler");
// const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

const { PORT = 4000 } = process.env;

// app.use(requestLogger);

app.use(express.json());
app.use(cors());

app.use("/", mainRouter);

// app.use(errorLogger);

// app.use(errors());
// app.use(errorHandler);

mongoose.connect("mongodb://127.0.0.1:27017/ben-shea-studios_db");

app.listen(PORT, () => {
  console.log(`Hello, from Port: ${PORT}`);
});

module.exports = app;
