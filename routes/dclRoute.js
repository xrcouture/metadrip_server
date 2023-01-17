const express = require("express");
const router = express.Router();

const {
    issueTokens,
    isValidItem,
    balanceOf,
} = require("../controllers/dclController")


router.post('/issueTokens', issueTokens);
router.get('/isValid', isValidItem);
router.get('/balanceOf', balanceOf);

module.exports = router;