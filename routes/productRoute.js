const express = require("express");
const router = express.Router();

const { 
    getNFTs,
    updateNFTs,
} = require("../controllers/productController");

router.post("/getNFTs", getNFTs);
router.post("/updateNFTs", updateNFTs);

module.exports = router;
