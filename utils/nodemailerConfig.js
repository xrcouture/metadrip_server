require("dotenv").config();

module.exports = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV == "production",
  },
};
