// express async error handlers
require("express-async-errors");

// express
const express = require("express");
const app = express();
const dclRouter = require("./routes/dclRoute");

// error handler
const errorHandlerMiddleware = require("./middleware/error-handler");
const CustomError = require("./errors");

// security package
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");

// middlewares
const notFoundMiddleware = require("./middleware/notFound");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// middleware for security
app.use(helmet());
app.use(cors({origin: process.env.ORIGIN, credentials: true}));
app.use(xss());

// routes
app.use("/contract", dclRouter);

// middleware for error handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
      const server = app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
      server.on("error", function (e) {
        console.log(`The port ${port} is already in use`)
        throw new CustomError.CustomAPIError("The port is busy");
      });
    } catch (error) {
      console.error(`Could not establish a connection to the Server on port ${port}`)
      throw new CustomError.CustomAPIError("Could not establish a connection");
    }
  };
  
  start();