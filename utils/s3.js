const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const multer = require("multer");
const path = require("path");
const constants = require("../utils/constants");
const logger = require("./logger");
const CustomError = require("../errors");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const namingConversion = (folderName, fileName) => {
  return folderName + "/" + Date.now() + "-" + fileName;
};

// AWS S3 client config
const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  sslEnabled: true,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

// FILTER OPTIONS LIKE VALIDATING FILE EXTENSION
const filter = (req, files, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(files.originalname).toLowerCase());
  const mimetype = filetypes.test(files.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    logger.error("S3 upload failed. Allow images only of extensions jpeg|jpg|png !");
    cb("Error: Allow images only of extensions jpeg|jpg|png !");
  }
};

// CREATE MULTER-S3 FUNCTION FOR STORAGE
const multerS3Config = (folderName) =>
  multerS3({
    s3: s3,
    // bucket - WE CAN PASS SUB FOLDER NAME ALSO LIKE 'bucket-name/sub-folder1'
    bucket: bucketName,
    // META DATA FOR PUTTING FIELD NAME
    metadata: function (req, files, cb) {
      cb(null, { fieldName: files.fieldname });
    },
    // SET / MODIFY ORIGINAL FILE NAME
    key: function (req, files, cb) {
      cb(null, namingConversion(folderName, files.originalname));
    },
  });

// CREATE MULTER FUNCTION FOR UPLOAD
const uploadToS3 = (folderName) =>
  multer({
    storage: multerS3Config(folderName),
    fileFilter: filter,
    limits: {
      fileSize: constants.MAX_UPLOAD_FILE_SIZE, // we are allowing only 200 MB files
    },
  });

module.exports = uploadToS3;
