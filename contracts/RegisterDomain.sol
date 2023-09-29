// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract RegisterDomain {

    struct Domain {
        address owner;
    }

    address public contractOwner;

    mapping(string => Domain) public domains;
    uint256 public registrationDeposit;

    event DomainRegistered(string domain, address owner, uint256 amount);
    event DomainReleased(string domain, address owner, uint256 amount);
    event OwnerChanged(address newOwner);
    event RegistrationDepositChanged(uint256 newDepositAmount);

    constructor() {
        contractOwner = msg.sender;
        registrationDeposit = 1 ether;
    }

    modifier isValidDomain(string memory _domain) {
        require(!containsDot(_domain), "Only top-level domains are allowed");
        _;
    }

    modifier isAvailable(string memory _domain) {
        require(domains[_domain].owner == address(0), "Domain registered");
        _;
    }

    modifier onlyDomainOwner(string memory _domain) {
        require(domains[_domain].owner == msg.sender, "Only domain owner can release the domain");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Is not the contract owner");
        _;
    }

    function registerDomain(string memory _domain) public payable isValidDomain(_domain) isAvailable(_domain) {
        require(msg.value == registrationDeposit, "Deposit amount incorrect");
        domains[_domain].owner = msg.sender;
        emit DomainRegistered(_domain, msg.sender, msg.value);
    }

    function releaseDomain(string memory _domain) public onlyDomainOwner(_domain) {
        payable(msg.sender).transfer(registrationDeposit);
        domains[_domain].owner = address(0);
        emit DomainReleased(_domain, msg.sender, registrationDeposit);
    }

    function changeOwner(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "New owner is the zero address");
        contractOwner = _newOwner;
        emit OwnerChanged(_newOwner);
    }

    function setRegistrationDeposit(uint256 _amount) public onlyOwner {
        registrationDeposit = _amount;
        emit RegistrationDepositChanged(_amount);
    }

    function getDomainOwner(string memory _domain) public view returns (address) {
        return domains[_domain].owner;
    }

    function owner() public view returns (address) {
        return contractOwner;
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