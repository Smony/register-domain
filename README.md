# Project Register Domain

The Register Domain project allows you to register a domain, use unique domains, and manage their owners and deposits.

## Install

```sh
npm install

[//]: # (npx hardhat compile)

npx hardhat test
```

## Documentation

### Contracts: RegisterDomain

#### Methods:

- **`registerDomain(string memory _domain) public payable`**
  - Registers a domain if it has not yet been registered, and if a correct deposit has been sent.
  - The `_domain` parameter must be a string without dots.

- **`releaseDomain(string memory _domain) public`**
  - Releases the domain. Can only be called by the domain owner.
  - Returns the deposit to the owner.

- **`getDomainOwner(string memory _domain) public view returns (address)`**
  - Returns the address of the domain owner.

- **`getDomainDeposit(string memory _domain) public view returns (uint256)`**
  - Returns the deposit amount for the domain.

#### Auxiliary Methods:

- **`containsDot(string memory _domain) internal pure returns (bool)`**
  - Checks whether a dot is contained in a domain string.

