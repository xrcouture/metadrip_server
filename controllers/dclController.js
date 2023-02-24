const helper = require("../utils/helper");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const logger = require("../utils/logger");
const DCLNft = require("../models/dcl");
const DCLDevClaimed = require("../models/dclDevClaimed");
const sendNotificationEmail = require("../utils/sendNotificationEmail");

const issueTokens = async (req, res) => {
  try {
    const { address, itemIds, contractId } = req.body;

    const dclContract = await helper.getContractInstance(contractId);
    const { maxFeePerGas, maxPriorityFeePerGas } = await helper.getGasFees();

    //fix for wrongly claimed DCL wearables
    const itemClaimedByDev = await DCLDevClaimed.find({
      itemId: itemIds[0],
      phase: contractId,
    }).sort({ tokenId: 1 });

    if (itemClaimedByDev) {
      const tx = await dclContract.transferFrom(
        itemClaimedByDev[0].walletAddress,
        address[0],
        itemClaimedByDev[0].tokenId,
        {
          maxFeePerGas,
          maxPriorityFeePerGas,
        }
      );
      await tx.wait();

      // delete from the dev database
      const deletedAsset = await DCLDevClaimed.findOneAndRemove(
        {
          itemId: itemIds[0],
          phase: contractId,
        },
        { sort: { tokenId: 1 } }
      );

      // update in the dcl database
      const dcl = await DCLNft.create({
        itemId: itemIds[0],
        walletAddress: address[0],
        phase: contractId,
      });


      const mailContent = `<p>DCL wearables of phase: ${contractId} for itemId: ${itemIds[0]} has been claimed by ${address[0]}</p>`;
      const mailSubject = "User claimed DCL wearables from metadrip";
      await sendNotificationEmail(mailContent, mailSubject);

      logger.info(`DevClaimed Issue Tokens Transaction successful. Tx hash: ${tx.hash}, itemId: ${itemIds[0]},
                wallet address: ${address[0]}, contract Phase: ${contractId}`);

      res.status(StatusCodes.CREATED).json({
        msg: `Tokens have been claimed successfully`,
        hash: `${tx.hash}`,
      });

      return;
    }
    // End of fix

    const itemCount = await dclContract.itemsCount();
    if (itemIds[0] > itemCount) {
      logger.error(
        `The itemId: ${itemIds[0]} exceeded the itemCount: ${itemCount}`
      );
      throw new CustomError.BadRequestError("Invalid Item Id");
    }

    const item = await dclContract.items(itemIds[0]);
    const totalSupply = Number(item.totalSupply._hex);
    logger.info(`The total supply of item ${itemIds[0]} is ${totalSupply}`);

    const maxSupply = Number(item.maxSupply._hex);
    logger.info(`The maxium supply of item ${itemIds[0]} is ${maxSupply}`);

    if (totalSupply >= maxSupply) {
      logger.error(`The NFT is fully claimed for itemId: ${itemIds[0]}, Max supply is ${maxSupply}
                   and total supply is ${totalSupply}`);
      throw new CustomError.BadRequestError("The NFT is fully claimed");
    }

    const itemAlreadyClaimed = await DCLNft.findOne({
      itemId: itemIds[0],
      walletAddress: address[0],
      phase: contractId,
    });
    if (itemAlreadyClaimed) {
      logger.error(
        `The item: ${itemIds[0]} of phase: ${contractId} is already claimed by: ${address[0]}`
      );
      throw new CustomError.BadRequestError("Item already claimed");
    }

    const tx = await dclContract.issueTokens(address, itemIds, {
      maxFeePerGas,
      maxPriorityFeePerGas,
    });
    await tx.wait();

    const dcl = await DCLNft.create({
      itemId: itemIds[0],
      walletAddress: address[0],
      phase: contractId,
    });

    const mailContent = `<p>DCL wearables of phase: ${contractId} for itemId: ${itemIds[0]} has been claimed by ${address[0]}</p>`;
    const mailSubject = "User claimed DCL wearables from metadrip";
    await sendNotificationEmail(mailContent, mailSubject);

    logger.info(`Issue Tokens Transaction successful. Tx hash: ${tx.hash}, itemId: ${itemIds[0]},
                wallet address: ${address[0]}, contract Phase: ${contractId}`);
    res.status(StatusCodes.CREATED).json({
      msg: `Tokens have been claimed successfully`,
      hash: `${tx.hash}`,
    });
  } catch (error) {
    logger.error(`Issue Tokens Transaction failed. ItemId: ${req.body.itemIds[0]}, wallet address: ${req.body.address[0]},
                 contract Phase: ${req.body.contractId}, error:${error}`);
    throw new CustomError.BadRequestError(error);
  }
};

const isItemClaimed = async (req, res) => {
  try {
    const { address, itemId, contractId } = req.body;
    const itemAlreadyClaimed = await DCLNft.findOne({
      itemId,
      walletAddress: address,
      phase: contractId,
    });
    if (itemAlreadyClaimed) {
      logger.info(
        `The item: ${itemId} of phase: ${contractId} is already claimed by: ${address}`
      );
      res.status(StatusCodes.OK).json({
        claimed: true,
        msg: "Item already claimed",
      });
      return;
    }
    logger.info(
      `The item: ${itemId} of phase: ${contractId} is not yet claimed by: ${address}`
    );
    res.status(StatusCodes.OK).json({
      claimed: false,
      msg: "Item not yet claimed",
    });
  } catch (error) {
    logger.error(`The get request for isItemClaimed method is failed. ItemId: ${req.body.itemId}, wallet address: ${req.body.address},
                 contract Phase: ${req.body.contractId}, error:${error}`);
    throw new CustomError.BadRequestError(error);
  }
};

module.exports = {
  issueTokens,
  isItemClaimed,
};
