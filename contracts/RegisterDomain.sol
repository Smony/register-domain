// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RegisterDomain {

    struct Domain {
        address owner;
        uint256 deposit;
    }

    mapping(string => Domain) public domains;
    uint256 public registrationDeposit = 1 ether;

    function registerDomain(string memory _domain) public payable {
        require(!containsDot(_domain), "Only top-level domains are allowed");
        require(domains[_domain].owner == address(0), "Domain registered");
        require(msg.value == registrationDeposit, "Deposit amount incorrect");

        domains[_domain] = Domain({
            owner: msg.sender,
            deposit: msg.value
        });
    }

    function releaseDomain(string memory _domain) public {
        require(domains[_domain].owner == msg.sender, "Only domain owner can release the domain");

        uint256 refundAmount = domains[_domain].deposit;
        domains[_domain].owner = address(0);
        domains[_domain].deposit = 0;

        payable(msg.sender).transfer(refundAmount);
    }

    function getDomainOwner(string memory _domain) public view returns (address) {
        return domains[_domain].owner;
    }

    function getDomainDeposit(string memory _domain) public view returns (uint256) {
        return domains[_domain].deposit;
    }

    function containsDot(string memory _domain) internal pure returns (bool) {
        for (uint i = 0; i < bytes(_domain).length; i++) {
            if (bytes(_domain)[i] == '.') {
                return true;
            }
        }
        return false;
    }
}