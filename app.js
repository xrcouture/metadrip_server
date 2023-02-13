// dotenv
require("dotenv").config();
// express async error handlers
require("express-async-errors");

// express
const express = require("express");
const app = express();

// database
const connectDB = require("./db/connect");

//helper
const helper = require("./utils/helper");
const constants = require("./utils/constants");

//  routers
const dclRouter = require("./routes/dclRoute");
const queryRouter = require("./routes/queryRoute");
const utilitiesRouter = require("./routes/utilityRoute");
const contactRouter = require("./routes/contactRoute");
const productRoute = require("./routes/productRoute");

//controllers
const { newTokenIDMinted } = require("./controllers/productController");

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
app.use("/utility", utilitiesRouter);
app.use("/user", contactRouter);
app.use("/product", productRoute);

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
const listenToEvents = async() => {
  const phase1Instance = await helper.getMetaDripContractInstance(1);
  phase1Instance.on("Transfer", async (from, to, tokenId) => {
    // Handle transfer events during minting and update DB
    if (from == constants.EMPTY_ADDRESS) {
      logger.info(`New TokenId: ${Number(tokenId._hex)} is minted for Phase 1`);
      await newTokenIDMinted(1, Number(tokenId._hex));
    }
  });

  const phase2Instance = await helper.getMetaDripContractInstance(2);
  phase2Instance.on("Transfer", async (from, to, tokenId) => {
    // Handle transfer events during minting and update DB
    if (from == constants.EMPTY_ADDRESS) {
      logger.info(`New TokenId: ${Number(tokenId._hex)} is minted for Phase 2`);
      await newTokenIDMinted(2, Number(tokenId._hex));
    }
  });
  logger.info(`Listening to phase 1 and phase 2 contract events`);
}

start();

listenToEvents();
