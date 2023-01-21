const CustomError = require("../errors");
const logger = require("../utils/logger");
const Whitelist = require("../models/whitelist")

// **********************************verifyWhitelist Middleware**********************************
const verifyWhitelist = async (req, res, next) => {
  const { address } = req.body;

  try {
    const userWhitelisted = await Whitelist.findOne({ address });
    if (userWhitelisted) {
      return next();
    }
    const payload = isTokenValid(refreshToken);

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    if (!userWhitelisted) {
      logger.error(`The wallet address: ${address} is not  whitelist`);
      throw new CustomError.UnauthenticatedError("Invalid user");
    }
  } catch (error) {
    logger.error(
      `Authentication Invalid during whitelist verification. Error msg: ${error}`
    );
    throw new CustomError.UnauthenticatedError(`Authentication Invalid. Error msg: ${error}`);
  }
};

module.exports = {
  verifyWhitelist,
};
