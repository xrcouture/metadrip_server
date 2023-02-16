require("dotenv").config();
const ethers = require("ethers");
const axios = require("axios");
const CustomError = require("../errors");
const logger = require("./logger");

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const DCL_PHASE1_CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS_1;
const DCL_PHASE2_CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS_2;
const METADRIP_PHASE1_CONTRACT_ADDRESS = process.env.METADRIP_CONTRACT_ADDRESS_1;
const METADRIP_PHASE2_CONTRACT_ADDRESS = process.env.METADRIP_CONTRACT_ADDRESS_2;
const NETWORK = process.env.NETWORK;

const dclPhase1Contract = require("../contracts/DCL_1.json");
const dclPhase2Contract = require("../contracts/DCL_2.json");
const metadripPhase1Contract = require("../contracts/MetaDrip_1.json");
const metadripPhase2Contract = require("../contracts/MetaDrip_2.json");

const getContractInstance = async (contractId) => {
  try {
    const contract = contractId == 1 ? dclPhase1Contract : dclPhase2Contract;
    const CONTRACT_ADDRESS =
      contractId == 1 ? DCL_PHASE1_CONTRACT_ADDRESS : DCL_PHASE2_CONTRACT_ADDRESS;

    // provider - Alchemy
    const alchemyProvider = new ethers.providers.AlchemyProvider(
      (network = NETWORK),
      API_KEY
    );

    // signer - you
    const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

    // contract instance
    const dclContract = new ethers.Contract(CONTRACT_ADDRESS, contract, signer);
    logger.info(`GetContractInstance for Phase: ${contractId}, contract Address : ${CONTRACT_ADDRESS}`);

    return dclContract;
  } catch (error) {
    logger.error(`Error while getting contract Instance. Contract Phase: ${contractId}, error: ${error}`);
    throw new CustomError.BadRequestError(error);
  }
};

const getMetaDripContractInstance = async (contractId) => {
  try {
    const contract = contractId == 1 ? metadripPhase1Contract : metadripPhase2Contract;
    const CONTRACT_ADDRESS =
      contractId == 1 ? METADRIP_PHASE1_CONTRACT_ADDRESS : METADRIP_PHASE2_CONTRACT_ADDRESS;

    // provider - Alchemy
    const alchemyProvider = new ethers.providers.AlchemyProvider(
      (network = NETWORK),
      API_KEY
    );

    // signer - you
    const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

    // contract instance
    const metadripContract = new ethers.Contract(CONTRACT_ADDRESS, contract, signer);
    logger.info(`getMetaDripContractInstance for Phase: ${contractId}, contract Address : ${CONTRACT_ADDRESS}`);

    return metadripContract;
  } catch (error) {
    logger.error(`Error while getting metadrip contract Instance. Contract Phase: ${contractId}, error: ${error}`);
    throw new CustomError.BadRequestError(error);
  }
};

const getGasFees = async () => {
  try {
    const { data } = await axios({
      method: "get",
      url: "https://gasstation-mainnet.matic.network/v2",
    });

    const maxFeePerGas = ethers.utils.parseUnits(
      Math.ceil(data.fast.maxFee) + "",
      "gwei"
    );
    const maxPriorityFeePerGas = ethers.utils.parseUnits(
      Math.ceil(data.fast.maxPriorityFee) + "",
      "gwei"
    );

    logger.info(`Gas fees successfully calculated. maxFeePerGas: ${maxFeePerGas}, maxPriorityFeePerGas: ${maxPriorityFeePerGas}`);
    return { maxFeePerGas, maxPriorityFeePerGas };
  } catch (error) {
    logger.error(`Error while getting gas fees. error: ${error}`);
    throw new CustomError.BadRequestError(error);
  }
};

module.exports = {
  getContractInstance,
  getGasFees,
  getMetaDripContractInstance,
};
