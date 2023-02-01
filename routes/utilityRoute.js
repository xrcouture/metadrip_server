const express = require("express");
const uploadToS3 = require("../utils/s3");
const {
  uploadAssets,
  isVirtualFittingClaimed,
} = require("../controllers/utilityController");

const router = express.Router();

router.post(
  "/upload",
  uploadToS3("Metadrip/Virtual Fitting/User").any("file"),
  uploadAssets
);
router.post("/isItemClaimed", isVirtualFittingClaimed);

module.exports = router;
