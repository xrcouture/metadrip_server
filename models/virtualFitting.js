const mongoose = require("mongoose");
const validator = require("validator");

const virtualFittingSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  comments: {
    type: String,
    maxlength: 1000,
  },
  photoUrl: {
    type: [String],
    required: [true, "Please provide valid photoUrl"],
  },
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
});

module.exports = mongoose.model("virtualFitting", virtualFittingSchema, "virtualFitting");