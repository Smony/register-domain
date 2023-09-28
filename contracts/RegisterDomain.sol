// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RegisterDomain {

    struct Domain {
        address owner;
    }

    mapping(string => Domain) public domains;
    uint256 public immutable registrationDeposit = 1 ether;

    event DomainRegistered(string domain, address owner, uint256 amount);
    event DomainReleased(string domain, address owner, uint256 amount);

    modifier isValidDomain(string memory _domain) {
        require(!containsDot(_domain), "Only top-level domains are allowed");
        _;
    }

    modifier isAvailable(string memory _domain) {
        require(domains[_domain].owner == address(0), "Domain registered");
        _;
    }

    modifier onlyOwner(string memory _domain) {
        require(domains[_domain].owner == msg.sender, "Only domain owner can release the domain");
        _;
    }

    function registerDomain(string memory _domain) public payable isValidDomain(_domain) isAvailable(_domain) {
        require(msg.value == registrationDeposit, "Deposit amount incorrect");
        domains[_domain].owner = msg.sender;
        emit DomainRegistered(_domain, msg.sender, msg.value);
    }

    function releaseDomain(string memory _domain) public onlyOwner(_domain) {
        payable(msg.sender).transfer(registrationDeposit);
        domains[_domain].owner = address(0);
        emit DomainReleased(_domain, msg.sender, registrationDeposit);
    }

    function getDomainOwner(string memory _domain) public view returns (address) {
        return domains[_domain].owner;
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