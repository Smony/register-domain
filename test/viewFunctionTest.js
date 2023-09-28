const {expect} = require("chai");
const {ethers} = require("hardhat");

const { setupContracts } = require("./helperTest");
const { VALID_DEPOSIT, NOT_VALID_DEPOSIT } = require('./constants');

describe("RegisterDomain - View Functions Tests", function () {
    beforeEach(async function () {
        ({ registerDomain, addr1} = await setupContracts());
    });

    it("Should return the correct owner of the domain", async function() {
        await registerDomain.connect(addr1).registerDomain("ua", { value: VALID_DEPOSIT });
        expect(await registerDomain.getDomainOwner("ua")).to.equal(addr1.address);
    });
});
