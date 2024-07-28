import { useState } from "react";
import {
  VStack,
  HStack,
  Box,
  Text,
  Image,
  Button,
  Spinner,
  useToast,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import Web3 from "web3";


import { formatAddress, formatChainAsNum } from "../utils/index";

import styles from "./Main.module.css";

import { useMetaMask } from "../hooks/useMetaMask";
import { useDappConfig } from "../hooks/useDappConfig";
import { isSupportedNetwork } from "../lib/isSupportedNetwork";

import nftContract from "../api/retrieveBalance.ts";
import NFTLending from '../constants/NFTLending.json';

const Main = () => {
  const [nftDetails, setNftDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [tokenId, setTokenId] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [duration, setDuration] = useState("");
  const toast = useToast();

  const { wallet, connectMetaMask, sdk } = useMetaMask();
  const walletChainSupported = isSupportedNetwork(wallet.chainId);
  const { dapp } = useDappConfig();

  const fetchNFTURI = async (tokenId: number) => {
    try {
      const tokenURI = await nftContract.methods.tokenURI(tokenId).call();
      return { tokenId, tokenURI };
    } catch (err) {
      setError(
        `Error fetching NFT details for token ID ${tokenId}: ${err.message}`
      );
      return null;
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const wichselectedTokenId = async () => {
    console.log('selectedTokenId',selectedTokenId);
  }

  const fetchNFT = async () => {
    const details = [];
    setLoading(true);

    for (let tokenId = 0; tokenId <= 2; tokenId++) {
      const nftDetail = await fetchNFTURI(tokenId);
      if (nftDetail) {
        details.push(nftDetail);
      }
      await delay(1000);
    }
    setNftDetails(details);
    setLoading(false);
  };


  const makeALoan = async () => {
    console.log('window.ethereum',window.ethereum);
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();

        const contractAddress = '0x2Da6CdAC3f510B70bF62A1e5b690eFA59D964491'; 
        const contractABI = NFTLending

        const nftLending = new web3.eth.Contract(contractABI, contractAddress);
        console.log('accounts',accounts);
        const tx = await nftLending.methods.createLoan(tokenId, loanAmount, interestRate, duration).send({ from: accounts[0] });

        // When the tx is successful, the toast will be displayed
        if (tx) {
          toast({
            title: "Loan created.",
            description: "Your loan has been created successfully.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setIsModalOpen(false);
        }

    } else {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to use this feature.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to create loan: ${err.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <div className={styles.navigation}>
        <div className={styles.flexContainer}>
          <div className={styles.leftNav}></div>
          <div className={styles.rightNav}>
            {wallet.accounts.length < 1 && (
              <Button colorScheme="whiteAlpha" onClick={connectMetaMask}>
                Connect MetaMask
              </Button>
            )}
            <>
              {wallet && wallet.accounts.length > 0 && (
                <>
                  {walletChainSupported &&
                  dapp.chainInfo?.contractAddress !== "" ? (
                    <a
                      href={`${dapp.chainInfo?.blockExplorer}/address/${dapp.chainInfo?.contractAddress}`}
                      target="_blank"
                      title="Open in Block Explorer"
                    >
                      {dapp.chainInfo.name}:{formatChainAsNum(wallet.chainId)}
                    </a>
                  ) : (
                    <>
                      {dapp.chainInfo.name}:{formatChainAsNum(wallet.chainId)}
                    </>
                  )}
                  &nbsp;|&nbsp;
                  <a
                    href={`https://etherscan.io/address/${wallet}`}
                    target="_blank"
                    title="Open in Block Explorer"
                  >
                    {formatAddress(wallet.address)}
                  </a>
                  <div className={styles.balance}>{wallet.balance} ETH</div>
                  <Button
                    colorScheme="whiteAlpha"
                    onClick={() => sdk?.terminate()}
                  >
                    DISCONNECT
                  </Button>
                </>
              )}
            </>
          </div>
        </div>
      </div>
      <Box alignItems="center" marginTop="20px">
        <Heading textAlign="center">
          Lend and Borrow <br />
          by collateralizing your NFT
        </Heading>
      </Box>
      {/* create the lending and borrowing with NFT collateralize  */}
      <Box margin={"50px"}>
        <HStack spacing={100} padding={"20px"}>
          {nftDetails ? (
            <Heading>Your NFT</Heading>
          ) : (
            !loading && (
              <Button
                onClick={fetchNFT}
                backgroundColor="#000000"
                color="white"
                size="md"
              >
                Fetch NFT
              </Button>
            )
          )}

          <VStack spacing={4} p={5}>
            {loading ? (
              <Spinner size="xl" speed="0.80s" />
            ) : (
              nftDetails?.length > 0 && (
                <HStack spacing={4} p={4} borderWidth="1px" borderRadius="lg">
                  {nftDetails?.map((nft) => (
                    <VStack
                      key={nft.tokenId}
                      spacing={4}
                      p={4}
                      borderWidth="1px"
                      borderRadius="lg"
                    >
                      <HStack>
                        <Text fontWeight="bold">Token ID:</Text>
                        <Text>{nft.tokenId}</Text>

                        <Text fontWeight="bold"> Value </Text>
                        <Text> </Text>
                      </HStack>
                      <Box>
                        <Image
                          src={nft.tokenURI}
                          alt={`NFT ${nft.tokenId}`}
                          boxSize="200px"
                          objectFit="cover"
                        />
                      </Box>
                      <Button
                        backgroundColor="#000000"
                        color="white"
                        size="md"
                        onClick={() => {
                          setSelectedTokenId(nft.tokenId);
                          setIsModalOpen(true);
                          wichselectedTokenId(); 
                        }}
                      >
                        Make a Loan
                      </Button>
                      <Button backgroundColor="#000000" color="white" size="md">
                        Borrow
                      </Button>
                    </VStack>
                  ))}
                </HStack>
              )
            )}
            {error && <Text color="red.500">{error}</Text>}
          </VStack>
        </HStack>
      </Box>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Make a Loan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <FormControl>
              <FormLabel>NFT Token ID</FormLabel>
              <Input
                type="number"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
              />
             
            </FormControl>
            <FormControl>
              <FormLabel>Loan Amount</FormLabel>
       
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Interest Rate</FormLabel>
              <Input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Duration</FormLabel>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button backgroundColor="#000000" color="white"  mr={3} onClick={makeALoan}>
              Submit
            </Button>
            <Button backgroundColor="red" color="white"  onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Main;
