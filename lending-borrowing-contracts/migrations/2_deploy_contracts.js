const NFTLending = artifacts.require("NFTLending");

module.exports = function (deployer) {
  const nftContractAddress = "0x20DE433C3C7E8efEb607aCc3892584972D0cC0c3"; 
  deployer.deploy(NFTLending, nftContractAddress);
};