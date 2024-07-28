const NFTLending = artifacts.require("NFTLending");

module.exports = function (deployer) {
  const nftContractAddress = "NFT_CONTRACT_ADDRESS";
  deployer.deploy(NFTLending, nftContractAddress);
};