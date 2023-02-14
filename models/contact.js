const mongoose = require("mongoose");
const validator = require("validator");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  phone: {
    type: Number,
  },
  message: {
    type: String,
    required: [true, "Please provide message"],
    maxlength: 500,
  },
});

module.exports = mongoose.model("contacts", contactSchema, "contacts");
