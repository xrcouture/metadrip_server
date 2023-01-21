require("dotenv").config();
const ethers = require("ethers");
const axios = require("axios");
const CustomError = require("../errors");

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PHASE1_CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS_1;
const PHASE2_CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS_2;
const NETWORK = process.env.NETWORK;

const phase1Contract = require("../contracts/MetaDrip_1.json");
const phase2Contract = require("../contracts/MetaDrip_2.json");

const getContractInstance = async (contractId) => {
  try {
    const contract = contractId == 1 ? phase1Contract : phase2Contract;
    const CONTRACT_ADDRESS =
      contractId == 1 ? PHASE1_CONTRACT_ADDRESS : PHASE2_CONTRACT_ADDRESS;

    // provider - Alchemy
    const alchemyProvider = new ethers.providers.AlchemyProvider(
      (network = NETWORK),
      API_KEY
    );

    // signer - you
    const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

    // contract instance
    const dclContract = new ethers.Contract(CONTRACT_ADDRESS, contract, signer);

    return dclContract;
  } catch (error) {
    console.error(error);
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

    return { maxFeePerGas, maxPriorityFeePerGas };
  } catch (error) {
    console.error(error);
    throw new CustomError.BadRequestError(error);
  }
};

module.exports = {
  getContractInstance,
  getGasFees,
};
