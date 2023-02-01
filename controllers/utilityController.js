const logger = require("../utils/logger");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const virtualFitting = require("../models/virtualFitting");

// **********************************uploadAssets Controller**********************************

const uploadAssets = async (req, res, next) => {
  let url = [];
  const fileNames = req.files.map((file) => {
    url.push(file.location);
    return file.originalname;
  });
  logger.info(`Successfully uploaded  ${fileNames} to amazon s3 bucket`);

  await virtualFitting.create({
    photoUrl: url,
    email: req.body.email,
    comments: req.body.comments,
    itemId: req.body.itemId,
    walletAddress: req.body.address,
    phase: req.body.contractId,
  });

  logger.info(
    `The photo info has been successfully updated to db. mailId: ${req.body.email}, comments: ${req.body.comments}`
  );
  res.send("Successfully uploaded " + req.files.length + " files");
};

const isVirtualFittingClaimed = async (req, res) => {
  try {
    const { address, itemId, contractId } = req.body;
    const itemAlreadyClaimed = await virtualFitting.findOne({
      itemId: itemId,
      walletAddress: address,
      phase: contractId,
    });
    if (itemAlreadyClaimed) {
      logger.info(
        `The item: ${itemId} of phase: ${contractId} is already claimed by: ${address} for virtual fitting`
      );
      res.status(StatusCodes.OK).json({
        claimed: true,
        msg: "Item already claimed",
      });
      return;
    }
    logger.info(
      `The item: ${itemId} of phase: ${contractId} is not yet claimed by: ${address} for virtual fitting`
    );
    res.status(StatusCodes.OK).json({
      claimed: false,
      msg: "Item not yet claimed",
    });
  } catch (error) {
    logger.error(`The get request for isVirtualFittingClaimed method is failed. ItemId: ${req.body.itemId}, wallet address: ${req.body.address},
                        contract Phase: ${req.body.contractId}, error:${error}`);
    throw new CustomError.BadRequestError(error);
  }
};

module.exports = {
  uploadAssets,
  isVirtualFittingClaimed,
};
