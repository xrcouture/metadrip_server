// dotenv
require("dotenv").config();
// express async error handlers
require("express-async-errors");

// express
const express = require("express");
const app = express();

// database
const connectDB = require("./db/connect");

//  routers
const dclRouter = require("./routes/dclRoute");
const queryRouter = require("./routes/queryRoute");

// error handler
const errorHandlerMiddleware = require("./middleware/error-handler");
const CustomError = require("./errors");

// security package
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

// middlewares
const notFoundMiddleware = require("./middleware/notFound");

// logging
const logger = require("./utils/logger");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// middleware for security
app.use(helmet());
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(xss());
app.use(mongoSanitize());

// routes
app.use("/contract", dclRouter);
app.use("/query", queryRouter);

// middleware for error handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    logger.info("Connection to MongoDB is successfully established");
    const server = app.listen(port, () =>
      logger.info(`Server is listening on port ${port}...`)
    );
    server.on("error", function (e) {
      logger.info(`The port ${port} is already in use`);
      throw new CustomError.CustomAPIError("The port is busy");
    });
  } catch (error) {
    logger.error(
      `Could not establish a connection to the Server on port ${port}`
    );
    throw new CustomError.CustomAPIError("Could not establish a connection");
  }
};

start();
