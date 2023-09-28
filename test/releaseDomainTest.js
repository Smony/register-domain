const {expect} = require("chai");
const {ethers} = require("hardhat");

const { setupContracts } = require("./helperTest");
const { VALID_DEPOSIT, NOT_VALID_DEPOSIT } = require('./constants');

describe("RegisterDomain - Domain Release Tests", function () {
    before(async function () {
        ({ registerDomain, addr1, addr2 } = await setupContracts());
    });

    it("Allow the owner to release the domain", async function () {
        await registerDomain.connect(addr1).registerDomain("com", { value: VALID_DEPOSIT });
        await expect(() => registerDomain.connect(addr1).releaseDomain("com")).not.to.throw();
    });

    it("Not allow non-owners to release the domain", async function () {
        await registerDomain.connect(addr1).registerDomain("net", { value: VALID_DEPOSIT });
        await expect(registerDomain.connect(addr2).releaseDomain("net"))
            .to.be.revertedWith("Only domain owner can release the domain");
    });

    it("Reset domain owner and deposit after release", async function () {
        await registerDomain.connect(addr1).registerDomain("ua", { value: VALID_DEPOSIT });
        await registerDomain.connect(addr1).releaseDomain("ua");

        const domainOwner = await registerDomain.getDomainOwner("ua");

        expect(domainOwner).to.equal(ethers.constants.AddressZero);
    });

    it("Refund the deposit to the owner after release", async function () {
        await registerDomain.connect(addr1).registerDomain("biz", { value: VALID_DEPOSIT });

        const initialBalance = await addr1.getBalance();
        const tx = await registerDomain.connect(addr1).releaseDomain("biz");
        const gasUsed = (await tx.wait()).gasUsed;
        const finalBalance = await addr1.getBalance();

        expect(finalBalance).to.equal(initialBalance.sub(gasUsed.mul(tx.gasPrice)).add(VALID_DEPOSIT));
    });
});