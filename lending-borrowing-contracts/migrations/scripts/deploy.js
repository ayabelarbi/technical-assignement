const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile'); // Assuming you have a compile.js that compiles the contract

require('dotenv').config();
const { MNEMONIC, PROJECT_ID } = process.env;

const provider = new HDWalletProvider(
    MNEMONIC,
  `https://mainnet.infura.io/v3/${PROJECT_ID}` 
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ from: accounts[0], gas: '2000000' });

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};

deploy();