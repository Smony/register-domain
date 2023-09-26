const {expect} = require("chai");
const {ethers} = require("hardhat");

const { setupContracts } = require("./helperTest");
const { VALID_DEPOSIT, NOT_VALID_DEPOSIT } = require('./constants');

describe("RegisterDomain - Domain Registration Tests", function () {
    before(async function () {
        ({ registerDomain, addr1 } = await setupContracts());
    });

    it("Register a domain with valid deposit", async function () {
        await registerDomain.connect(addr1).registerDomain("com", {value: VALID_DEPOSIT});
        expect(await registerDomain.getDomainOwner("com")).to.equal(addr1.address);
    });

    it("Register a domain with invalid deposit", async function () {
        await expect(registerDomain.connect(addr1).registerDomain("ua", {value: NOT_VALID_DEPOSIT}))
            .to.be.revertedWith("Deposit amount incorrect");
    });

    it("Register a domain that is already registered", async function () {
        await registerDomain.connect(addr1).registerDomain("org", {value: VALID_DEPOSIT});
        await expect(registerDomain.connect(addr1).registerDomain("org", {value: VALID_DEPOSIT}))
            .to.be.revertedWith("Domain registered");
    });

    it("Not allow registration of subdomains", async function () {
        await expect(registerDomain.connect(addr1).registerDomain("domain.com", { value: VALID_DEPOSIT}))
            .to.be.revertedWith("Only top-level domains are allowed");
    });

});
