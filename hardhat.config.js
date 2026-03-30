require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/ER-yYBnCo3s0VkKlNSEJh",
      accounts: ["0x7cf62cde13d3342477dc45536adbf64eefe69d331ab3e7759b96509fe915b46c"],
    },
  },
};

