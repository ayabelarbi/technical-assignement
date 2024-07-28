import web3 from '../hooks/web3.ts';
import NFTmint from '../constants/NFTmint.json';

const contractAddress = '0x20DE433C3C7E8efEb607aCc3892584972D0cC0c3';
const contractABI = NFTmint

const nftContract = new web3.eth.Contract(contractABI, contractAddress);

export default nftContract;
