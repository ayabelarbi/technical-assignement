import Web3 from 'web3';

const INFURA_PROJECT_ID = import.meta.env.VITE_INFURA_API_KEY;

console.log('INFURA_PROJECT_ID', INFURA_PROJECT_ID);

const infuraUrl = `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`;
const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

export default web3;

