const mongoose = require("mongoose");
const validator = require("validator");

const newsLetterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  time : { type : Date, default: Date.now }
});

module.exports = mongoose.model("newsLetter", newsLetterSchema, "newsLetter");