const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const blogRouter = require("./controllers/blogs");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const middleware = require("./utils/middleware");

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("connected to MongoDB"))
  .catch((error) => logger.error("error to connecting MongoDB", error.message));

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogRouter);
app.use(middleware.errorHandler);

module.exports = app;
