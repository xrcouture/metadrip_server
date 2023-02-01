const express = require("express");
const router = express.Router();

const { userQuery } = require("../controllers/queryController");

router.post("/set", userQuery);

module.exports = router;
