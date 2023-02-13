const express = require("express");
const router = express.Router();

const { contactUs, registerForNewsLetter } = require("../controllers/contactController");

router.post("/contact", contactUs);
router.post("/newsLetter", registerForNewsLetter)

module.exports = router;