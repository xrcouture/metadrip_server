const mongoose = require("mongoose");

const whitelistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide valid Email address"],
  },
  walletAddress: {
    type: String,
    unique: true,
    required: [true, "Please provide valid wallet address"],
  },
});

module.exports = mongoose.model("whitelist", whitelistSchema, "whitelist");
