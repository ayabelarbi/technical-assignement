const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const NFTLendingModule = buildModule("NFTLendingModule", (m) => {
  const initialOwner = m.getParameter("initialOwner", "0x8309f68a92a3154457594dc8Ce214f2FC69e946c"); // Replace with the initial owner address
  const nftContractAddress = m.getParameter("nftContractAddress", "0x20DE433C3C7E8efEb607aCc3892584972D0cC0c3"); // Replace with your NFT contract address

  const nftLending = m.contract("NFTLending", [initialOwner, nftContractAddress]);

  return { nftLending };
});

module.exports = NFTLendingModule;