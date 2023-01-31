const express = require("express");
const router = express.Router();

const {
  issueTokens,
  isItemClaimed
} = require("../controllers/dclController");

router.post("/issueTokens", issueTokens);
router.get("/isItemClaimed", isItemClaimed);

module.exports = router;
