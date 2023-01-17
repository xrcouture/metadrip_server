require('dotenv').config();
const ethers = require("ethers");
const axios = require("axios")
const CustomError = require("../errors");

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const NETWORK = process.env.NETWORK;

const contract = require("../contracts/DCL-XRC.json");

const getContractInstance = async () => {
    try {
        // provider - Alchemy
        const alchemyProvider = new ethers.providers.AlchemyProvider(network=NETWORK, API_KEY);

        // signer - you
        const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

        // contract instance
        const dclContract = new ethers.Contract(CONTRACT_ADDRESS, contract, signer);

        return dclContract;
    } catch(error) {
        console.error(error)
        throw new CustomError.BadRequestError(error);
    }
}

const getGasFees = async () => {
    try {
        const { data } = await axios({
            method: 'get',
            url:'https://gasstation-mainnet.matic.network/v2',
        })

        const maxFeePerGas = ethers.utils.parseUnits(
            Math.ceil(data.fast.maxFee) + '',
            'gwei'
        )
        const maxPriorityFeePerGas = ethers.utils.parseUnits(
            Math.ceil(data.fast.maxPriorityFee) + '',
            'gwei'
        )

        return {maxFeePerGas, maxPriorityFeePerGas};

    } catch(error) {
        console.error(error)
        throw new CustomError.BadRequestError(error);
    }
}

module.exports = {
    getContractInstance,
    getGasFees,
}