const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  itemId: {
    type: Number,
    required: [true, "Please provide valid itemId"],
    min: 0,
    max: 5
  },
  name: {
    type: String,
    required: [true, "Please provide valid product name"],
  },
  phase: {
    type: Number,
    required: [true, "Please provide valid contract phase"],
    min: 1,
    max: 2
  },
  price: {
    type: Number,
  },
  totalMinted: {
    type: Number,
  },
  tokenId: {
    type: Number,
    required: [true, "Please provide valid tokenId"],
  },
});

module.exports = mongoose.model("product", productSchema, "product");