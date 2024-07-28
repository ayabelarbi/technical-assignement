import { useEffect, useState } from "react";
import {
  Button,
  Box,
  Heading,
  HStack,
  VStack,
  Text,
  Spinner,
  Image,
} from "@chakra-ui/react";

import { formatAddress, formatChainAsNum } from "../utils/index";

import styles from "./Main.module.css";

import { useMetaMask } from "../hooks/useMetaMask";
import { useDappConfig } from "../hooks/useDappConfig";
import { isSupportedNetwork } from "../lib/isSupportedNetwork";

import nftContract from "../api/retrieveBalance.ts";

// import SwitchNetwork from '../components/SwitchNetwork/SwitchNetwork'

const Main = () => {
  const [tokenId, setTokenId] = useState("");
  const [nftDetails, setNftDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const fetchNFTPrice = async (tokenId: number) => {
    try {
      const tokenPrice = await nftContract.methods.tokenPrice(tokenId).call();
      return { tokenId, tokenPrice };
    } catch (err) {
      setError(
        `Error fetching NFT details for token ID ${tokenId}: ${err.message}`
      );
      return null;
    }
  }
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

  useEffect(() => {
    console.log("nftDetail", nftDetails);
  }, [nftDetails]);
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
              <Button onClick={fetchNFT} backgroundColor="#000000" color="white" size="md">
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
                      <Button backgroundColor="#000000" color="white" size="md">
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
    </>
  );
};

export default Main;
