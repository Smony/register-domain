const ethers = require('ethers');

const VALID_DEPOSIT = ethers.utils.parseEther('1.0');
const NOT_VALID_DEPOSIT = ethers.utils.parseEther('0.5');
const NEW_VALID_DEPOSIT = ethers.utils.parseEther('2.0');

module.exports = {
    VALID_DEPOSIT,
    NOT_VALID_DEPOSIT,
    NEW_VALID_DEPOSIT,
};