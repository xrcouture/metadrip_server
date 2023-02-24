const mongoose = require("mongoose");

const dclDevClaimedSchema = new mongoose.Schema({
  itemId: {
    type: Number,
    required: [true, "Please provide valid itemId"],
    min: 0,
    max: 5
  },
  walletAddress: {
    type: String,
    required: [true, "Please provide valid wallet address"],
  },
  phase: {
    type: Number,
    required: [true, "Please provide valid contract phase"],
    min: 1,
    max: 2
  },
  tokenId: {
    type: String,
    required: [true, "Please provide valid tokenId"],
  },
  assetName: {
    type: String,
    required: [true, "Please provide valid asset name"],
  },
});

module.exports = mongoose.model("dclDev", dclDevClaimedSchema, "dclDev");
