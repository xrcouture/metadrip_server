const { Network, Alchemy } = require("alchemy-sdk");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const logger = require("../utils/logger");
const product = require("../models/product");
const constants = require("../utils/constants");

const settings = {
  apiKey: "t6LDqfVgMsbxn0n7walxOXJVAwoHN455",
  network: Network.MATIC_MAINNET,
};

const itemArray = [
    "Chrome Heart",
    "Puffy Crossroads",
    "Oyster Spell",
    "Vibrance Splash",
    "Flora Flamboyance",
    "Rufflanza",
    "Star Cloak",
    "Celestial Dream",
    "Dazzling Devil",
    "Pop Kiss",
    "Comic Boom",
    "Human Masquerade"
];

const collectionAddress = [
    "0xede30df507576e461cc2cb3ada75bf9b22dc778d", //phase 1
    "0x99D6C0d1A656a1ee1F345AE6482D0aFD76daF8a5", //phase 2
];

const alchemy = new Alchemy(settings);

const getNFTs = async (req, res) => {
  const { name } = req.body;

  if(!name) {
    logger.error('Empty name is sent during getNFTs');
    throw new CustomError.BadRequestError("The name is empty");
  }

  const value = await product.find({name},{_id:0,name:1, tokenId:1, itemId:1, phase:1}).sort({tokenId:-1});
  let totalAvailable = 10 - (value[0].tokenId - value[0].itemId * 10)
  totalAvailable = totalAvailable > 0 ? totalAvailable : 0;

  res.status(StatusCodes.CREATED).json({
    data: value[0],
    totalAvailable: totalAvailable,
    price: constants.NFT_PRICE,
    msg: "Success! NFTs are retrieved",
  });
  logger.info(`SuccessFully retrieved NFTs for name: ${name}, itemId: ${value[0].itemId}, phase: ${value[0].phase}
                tokenId: ${value[0].tokenId}, totalAvailable: ${totalAvailable}`);
};

const updateNFTs = async (req, res) => {
    const contractAddress = req.body.contractAddress;

    if(!contractAddress) {
        logger.error('Empty contractAddress is sent during updateNFTs');
        throw new CustomError.BadRequestError("The contractAddress is empty");
    }

    const response = await alchemy.nft.getNftsForContract(contractAddress);
    for (let i = 0; i < response.nfts.length; i++) {
        const itemExist = await product.findOne({
            itemId: itemArray.findIndex((element) => element == response.nfts[i].rawMetadata.name) % 6,
            name: response.nfts[i].rawMetadata.name,
            phase: collectionAddress.findIndex((element) => element.toLowerCase() == response.nfts[i].contract.address) + 1,
            tokenId: response.nfts[i].tokenId,
        })
        if (!itemExist) {
            const storeProduct = await product.create({
                itemId: itemArray.findIndex((element) => element == response.nfts[i].rawMetadata.name) % 6,
                name: response.nfts[i].rawMetadata.name,
                phase: collectionAddress.findIndex((element) => element.toLowerCase() == response.nfts[i].contract.address) + 1,
                tokenId: response.nfts[i].tokenId,
            })
        }
    }
    res.status(StatusCodes.CREATED).json({
        msg: "Success! NFTs are updated in database",
    });
    logger.info(`SuccessFully updated NFTs to DB for contract ${contractAddress}`);
}

const newTokenIDMinted =async(phase, tokenId) => {
    const response = await alchemy.nft.getNftsForContract(collectionAddress[phase-1]);
    for (let i = 0; i < response.nfts.length; i++) {
        if(response.nfts[i].tokenId == tokenId) {
            const storeProduct = await product.create({
                itemId: itemArray.findIndex((element) => element == response.nfts[i].rawMetadata.name) % 6,
                name: response.nfts[i].rawMetadata.name,
                phase: collectionAddress.findIndex((element) => element.toLowerCase() == response.nfts[i].contract.address) + 1,
                tokenId: response.nfts[i].tokenId,
            })
        }
    }
    logger.info(`New tokenId: ${tokenId}, is minted and stored in DB for phase: ${phase}`);
}

module.exports = {
    getNFTs,
    updateNFTs,
    newTokenIDMinted,
};
