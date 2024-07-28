const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi } = require('./BatchMintNFT.json'); // Assuming you have the ABI of the deployed contract

const provider = new HDWalletProvider(
  'YOUR_MNEMONIC', // Replace with your wallet mnemonic
  'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID' // Replace with your Infura project ID
);

const web3 = new Web3(provider);

const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your deployed contract address
const contract = new web3.eth.Contract(abi, contractAddress);

// Change to deploy on ipfs urls
const pinataUrls = [
  'https://gateway.pinata.cloud/ipfs/QmbEBk1stimwtK9NsreG2QvjGm7Zexc8v6oknAJLmev6mh',
  'https://gateway.pinata.cloud/ipfs/Qmbt55u2ydecGyxVw9JJ9w9ZXU9uzr5aZ5nWGSsqGn8xxB',
  'https://gateway.pinata.cloud/ipfs/Qmas5ojMm3D8TA4yAZF7CokXC5dAPvC4jRc1B1jeWgY2p5',
  'https://gateway.pinata.cloud/ipfs/QmfMmm7HdHAwHxGY9HnKjwJu26PLMd8wj6awGU61KZwDjD'
];

const batchMint = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to batch mint from account', accounts[0]);

  await contract.methods.batchMint(accounts[0], pinataUrls)
    .send({ from: accounts[0], gas: '2000000' });

  console.log('Batch minting completed');
  provider.engine.stop();
};

batchMint();