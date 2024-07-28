import web3 from '../hooks/web3.ts';
import account from '../hooks/web3.ts';
import NFTLending from '../constants/NFTLending.json';

const contractAddress = '0x2Da6CdAC3f510B70bF62A1e5b690eFA59D964491';
const contractABI = NFTLending

const nftLending = new web3.eth.Contract(contractABI, contractAddress);
console.log('contract',nftLending);
console.log('acc',account);



export default nftLending;
