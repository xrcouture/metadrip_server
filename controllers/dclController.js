const helper = require("../utils/helper")
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");


const issueTokens = async (req, res) => {
    try {
        const { address, itemIds } = req.body;
        const dclContract = await helper.getContractInstance();
        const { maxFeePerGas, maxPriorityFeePerGas } = await helper.getGasFees();

        const tx = await dclContract.issueTokens(address, itemIds, {
            maxFeePerGas,
            maxPriorityFeePerGas,
        });
        await tx.wait();
        console.log(`Transaction successful: ${tx.hash}`)
        res.status(StatusCodes.CREATED).json({
            msg: `Tokens have minted successfully, ${tx.hash}`,
        });
    } catch(error) {
        console.error(error)
        throw new CustomError.BadRequestError(error);
    }
}


const isValidItem = async (req, res) => {
    try {
        const dclContract = await helper.getContractInstance();
        const itemId = req.body.itemId;
        const itemCount = await dclContract.itemsCount();
        const item = await dclContract.items(itemId);
        console.log(`The item is ${item} out of ${itemCount}`)
        res.status(StatusCodes.OK).json({
            msg: "Tokens validity status is returned",
        });
    } catch(error) {
        console.error(error)
        throw new CustomError.BadRequestError(error);
    }
}

const balanceOf = async (req, res) => {
    try {
        const dclContract = await helper.getContractInstance();
        const address  = req.body.address;
        const balance = await dclContract.balanceOf(address);
        console.log(`The balance of ${address} is ${balance}`)
        res.status(StatusCodes.OK).json({
            msg: "Balance of address is returned",
        });
    } catch(error) {
        console.error(error)
        throw new CustomError.BadRequestError(error);
    }
}

module.exports = {
    issueTokens,
    isValidItem,
    balanceOf,
}