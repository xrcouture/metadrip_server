const Query = require("../models/queries");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const logger = require("../utils/logger");
const sendNotificationEmail = require("../utils/sendNotificationEmail");

const userQuery = async (req, res) => {
  const { email, query } = req.body;

  if (!email || !query) {
    logger.error(`Empty email or query sent during user Query`);
    throw new CustomError.BadRequestError(
      "Please provide valid email and query"
    );
  }

  const user_Query = await Query.create({
    email,
    query,
  });

  const mailContent = `<p>A new user ${email} has sent us the query <q>${query}</q></p>`;
  const mailSubject = "User raised a query";
  await sendNotificationEmail(mailContent, mailSubject);

  res.status(StatusCodes.CREATED).json({
    msg: "Success! User Query is stored in the DB",
  });
  logger.info(
    `The user with mailId: ${email} has posted the below query\n\t\t ${query}`
  );
};

module.exports = {
  userQuery,
};
