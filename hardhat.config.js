require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const { ALICE, BOB } = process.env;

module.exports = {
  solidity: "0.8.9",
  networks: {
    tselendra: {
      url: "https://testnet-evm.selendra.org",
      chainId: 204,
      accounts: [ALICE, BOB],
    },
  },
};
