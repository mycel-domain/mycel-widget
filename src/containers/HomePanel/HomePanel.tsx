import {
  Alert,
  BottomLogo,
  Button,
  Header,
  HeaderButtons,
  TokenAmountForm,
  NameResolutionForm,
  useWallets,
  Spinner,
} from "../..";
import React, { useState } from "react";
import { styled } from "@stitches/react";
import {
  Transaction,
  Connection,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
import { LoadingStatus, TokenWithBalance } from "../../types/meta";
import { ConnectedWallet, TransactionType } from "../../types";
import { ethers } from "ethers";
import { AptosClient } from "aptos";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import {
  BestRouteResponse,
  BlockchainMeta,
  SwapResult,
} from "../../types/api/main";
import { useTransactionStore } from "../../store/transaction";
import { parseAptos } from "../../utils/common";
import erc20_abi from "../../constants/erc20_abi.json";

const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
});

const FromContainer = styled("div", {
  position: "relative",
  paddingBottom: "$12",
});

const Alerts = styled("div", {
  width: "100%",
  paddingTop: "$16",
});

const Footer = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  paddingTop: "$16",
});

const SpacerY = styled("div", {
  height: "$16",
});

interface HomePanelProps {
  bestRoute: BestRouteResponse | null;
  bestRouteError: string;
  fetchTransaction: () => void;
  onClickHistory: () => void;
  onClickSettings: () => void;
  fromChain: BlockchainMeta | null;
  toChain: BlockchainMeta | null;
  fromToken: TokenWithBalance | null;
  toToken: TokenWithBalance | null;
  toAddress: string | null;
  setInputAmount: (amount: string) => void;
  outputAmount: string;
  outputUsdValue: string;
  inputUsdValue: string;
  inputAmount: string;
  loadingStatus: LoadingStatus;
  showBestRoute: boolean;
  fetchingBestRoute: boolean;
  swapButtonTitle: string;
  swapButtonDisabled: boolean;
  swapButtonClick: () => void;
  onChainClick: (route: "from-chain" | "to-chain") => void;
  onTokenClick: (route: "from-token" | "to-token") => void;
  connectedWallets: ConnectedWallet[];
  isSending: boolean;
  highFee: boolean;
  errorMessage: string;
  hasLimitError: (bestRoute: BestRouteResponse | null) => boolean;
  swap: SwapResult | null;
  swapFromAmount: string | null;
  fromAmountRangeError: string;
  recommendation: string;
  totalFeeInUsd: string;
  swithFromAndToComponent: React.ReactNode;
  percentageChange: string;
  tokenBalanceReal: string;
  tokenBalance: string;
  totalTime: string;
  bestRouteData: BestRouteResponse | null;
  showPercentageChange: boolean;
}

export function HomePanel({
  bestRoute,
  bestRouteError,
  fetchTransaction,
  swapButtonDisabled,
  fromChain,
  fromToken,
  setInputAmount,
  toAddress,
  inputAmount,
  loadingStatus,
  swapButtonTitle,
  onChainClick,
  onTokenClick,
  connectedWallets,
  isSending,
}: HomePanelProps) {
  const { getSigners } = useWallets();
  const [txHash, setTxHash] = useState<string>();
  const [error, setError] = useState<string>("");
  const domainName = useTransactionStore.use.domainName();

  const sendTx = async (type: TransactionType) => {
    const signer = getSigners(connectedWallets[0].walletType).getSigner(type);
    const provider = signer.provider.provider; // Web3Provider.provider
    const signerAddress = await signer.signer.getAddress();
    useTransactionStore.setState({ isSending: true });

    if (type === "EVM") {
      const hex_chainId = ethers.utils.hexValue(Number(fromChain?.chainId));
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: hex_chainId,
            },
          ],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: hex_chainId,
                chainName: fromChain?.displayName,
                rpcUrls: [fromChain?.info?.rpcUrls[0]],
                nativeCurrency: {
                  decimals: fromChain?.defaultDecimals,
                  name: fromChain?.shortName,
                  symbol: fromChain?.feeAssets[0].symbol,
                },
              },
            ],
          });
        }
      }

      try {
        if (fromToken?.isNative) {
          // when selected token is native
          const ethTx = {
            blockChain: "Ethreum",
            isApprovalTx: false,
            from: signerAddress,
            to: toAddress,
            data: null,
            value: ethers.utils.parseEther(inputAmount),
            gasLimit: "0x714b3",
            gasPrice: null,
            nonce: null,
            type: "EVM",
          };

          const { hash } = await signer.signAndSendTx(
            ethTx as any,
            signerAddress,
            fromChain?.chainId as string
          );

          if (hash) {
            setTxHash(hash);
            useTransactionStore.setState({
              isSending: false,
            });
          }
        } else {
          // when selected token is non-native
          const tokenContract = new ethers.Contract(
            fromToken?.address as string,
            erc20_abi,
            signer.signer
          );

          const { hash } = await tokenContract.transfer(
            toAddress,
            ethers.utils.parseEther(inputAmount)
          );

          if (hash) {
            setTxHash(hash);
            useTransactionStore.setState({
              isSending: false,
            });
          }
        }
      } catch (e) {
        console.log(e);
        useTransactionStore.setState({ isSending: false });
      }
    } else if (type === "SOLANA") {
      try {
        const connection = new Connection(
          clusterApiUrl(fromChain?.isTestnet ? "testnet" : "mainnet-beta"),
          "confirmed"
        );

        const publicKey = signer.provider.publicKey;

        //TODO: restore if bitget transaction is successfull
        // const publicKey = signer.provider.publicKey.pubkey
        //   ? signer.provider.publicKey.pubkey
        //   : signer.provider._publicKey.toString();

        let blockhash = (await connection.getLatestBlockhash("finalized"))
          .blockhash;
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: new PublicKey(publicKey),
            toPubkey: new PublicKey(toAddress as string),
            lamports: (inputAmount as any) * LAMPORTS_PER_SOL,
          })
        );

        transaction.recentBlockhash = blockhash;
        transaction.feePayer = new PublicKey(publicKey);
        const tx = await signer.signTransaction(transaction);
        const rawTx = tx.transaction.serialize();
        const signature = await connection.sendRawTransaction(rawTx);
        if (signature) {
          setTxHash(
            !fromChain?.isTestnet ? signature : `${signature}?cluster=testnet`
          );
          useTransactionStore.setState({ isSending: false });
        }
      } catch (e) {
        console.log(e);
        useTransactionStore.setState({ isSending: false });
      }
    } else if (type === "APTOS") {
      try {
        const client = new AptosClient(
          fromChain?.isTestnet
            ? "https://fullnode.testnet.aptoslabs.com"
            : "https://fullnode.mainnet.aptoslabs.com"
        );

        const transaction = {
          arguments: [toAddress, parseAptos(inputAmount)],
          function: "0x1::coin::transfer",
          type: "entry_function_payload",
          type_arguments: ["0x1::aptos_coin::AptosCoin"],
        };

        const pendingTransaction = await getSigners("petra")
          .getSigner("APTOS" as TransactionType)
          .signAndSubmitTransaction(transaction);
        if (pendingTransaction.hash) {
          setTxHash(
            !fromChain?.isTestnet
              ? `${pendingTransaction.hash}?network=mainnet`
              : `${pendingTransaction.hash}?network=testnet`
          );
          client.waitForTransaction(pendingTransaction.hash);
          useTransactionStore.setState({ isSending: false });
        }
      } catch (e) {
        console.log(e);
        useTransactionStore.setState({ isSending: false });
      }
    } else if (type === "SUI") {
      try {
        const txb = new TransactionBlock();
        const [coin] = txb.splitCoins(txb.gas, [txb.pure(1)]);
        txb.transferObjects([coin], txb.pure(toAddress));

        const account = signer.provider.account;

        const transaction = {
          transactionBlock: txb,
          account,
        } as any;

        const res = await signer.provider.features[
          "sui:signAndExecuteTransactionBlock"
        ].signAndExecuteTransactionBlock(transaction);

        if (res) {
          console.log(res);
          useTransactionStore.setState({ isSending: false });
        }
      } catch (e) {
        console.log(e);
        useTransactionStore.setState({ isSending: false });
      }
    }
  };

  return (
    <Container>
      <Header
        title={"Send Token"}
        suffix={
          <HeaderButtons
            onClickRefresh={
              !!bestRoute || bestRouteError ? fetchTransaction : undefined
            }
          />
        }
      />
      <FromContainer>
        <>
          <TokenAmountForm
            onAmountChange={setInputAmount}
            chain={fromChain}
            token={fromToken}
            loadingStatus={loadingStatus}
            setInputAmount={setInputAmount}
            inputAmount={inputAmount}
            connectedWallets={connectedWallets}
            onChainClick={() => onChainClick("from-chain")}
            onTokenClick={() => onTokenClick("from-token")}
            setError={setError}
          />
        </>
      </FromContainer>
      <NameResolutionForm chain={fromChain} setError={setError} />
      <Footer>
        {fromChain?.info?.transactionUrl && txHash && (
          <>
            <Alert type="success">
              <div
                style={{
                  fontSize: "small",
                  overflowWrap: "anywhere",
                }}
              >
                Confirm:{" "}
                <a
                  style={{ color: "#0000ff" }}
                  target={"_blank"}
                  href={fromChain?.info?.transactionUrl + txHash}
                >
                  {txHash}
                </a>
              </div>
            </Alert>
            <SpacerY />
          </>
        )}
        {domainName && error && (
          <>
            <Alert type="error">
              <p
                style={{
                  fontSize: "small",
                  overflowWrap: "anywhere",
                }}
              >
                {error}
              </p>
            </Alert>
            <SpacerY />
          </>
        )}
        <Button
          type="primary"
          align="grow"
          size="large"
          disabled={swapButtonDisabled}
          onClick={() => sendTx(fromChain?.type)}
        >
          {!isSending ? swapButtonTitle : <Spinner size={20} />}
        </Button>
        <BottomLogo />
      </Footer>
    </Container>
  );
}
