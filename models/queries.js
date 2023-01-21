const mongoose = require("mongoose");
const validator = require("validator");

const queriesSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  query: {
    type: String,
    required: [true, "Please provide a valid query"],
    maxlength: 500,
  },
});

module.exports = mongoose.model("queries", queriesSchema, "queries");
