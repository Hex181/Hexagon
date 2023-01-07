require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    klaytn: {
      url: "https://api.baobab.klaytn.net:8651/",
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  solidity: "0.8.9",
};
