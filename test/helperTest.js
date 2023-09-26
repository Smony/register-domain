const { ethers } = require("hardhat");

async function setupContracts() {
    const RegisterDomain = await ethers.getContractFactory("RegisterDomain");
    const registerDomain = await RegisterDomain.deploy();
    await registerDomain.deployed();
    const [addr1, addr2] = await ethers.getSigners();
    return { registerDomain, addr1, addr2};
}

module.exports = {
    setupContracts
};
