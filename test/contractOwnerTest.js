const {expect} = require("chai");
const {ethers} = require("hardhat");

const { setupContracts } = require("./helperTest");
const { NEW_VALID_DEPOSIT } = require('./constants');

describe("RegisterDomain - Contract Owner Tests", function () {
    before(async function () {
        ({ registerDomain, addr1, addr2 } = await setupContracts());
    });

    it("Set the registration deposit by owner", async function () {
        await registerDomain.setRegistrationDeposit(NEW_VALID_DEPOSIT);
        expect(await registerDomain.registrationDeposit()).to.equal(NEW_VALID_DEPOSIT);
    });

    it("Not allow non-owners to set the registration deposit", async function () {
        await expect(registerDomain.connect(addr2).setRegistrationDeposit(NEW_VALID_DEPOSIT)).to.be.revertedWith("Is not the contract owner");
    });

    it("Able to change the owner by owner", async function () {
        await registerDomain.changeOwner(addr2.address);
        expect(await registerDomain.owner()).to.equal(addr2.address);
    });

    it("Not allow non-owners to change the owner", async function () {
        await expect(registerDomain.connect(addr1).changeOwner(addr2.address)).to.be.revertedWith("Is not the contract owner");
    });

    it("Emit RegistrationDepositChanged event when deposit amount is changed", async function () {
        await expect(registerDomain.connect(addr2).setRegistrationDeposit(NEW_VALID_DEPOSIT))
            .to.emit(registerDomain, 'RegistrationDepositChanged')
            .withArgs(NEW_VALID_DEPOSIT);
    });
});
