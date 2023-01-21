const express = require("express");
const router = express.Router();

const { verifyWhitelist } = require("../middleware/whitelistVerification");

const {
  issueTokens,
  isValidItem,
  balanceOf,
} = require("../controllers/dclController");

router.post("/issueTokens", verifyWhitelist, issueTokens);
router.get("/isValid", isValidItem);
router.get("/balanceOf", balanceOf);

module.exports = router;
