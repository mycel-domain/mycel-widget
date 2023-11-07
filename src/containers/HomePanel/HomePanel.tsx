import {
  Alert,
  BottomLogo,
  Button,
  Typography,
  Header,
  HeaderButtons,
  TokenInfo,
  useWallets,
  Spinner,
} from "../..";
import React, { useState } from "react";
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
  toChain,
  fromToken,
  toToken,
  setInputAmount,
  toAddress,
  outputAmount,
  inputAmount,
  loadingStatus,
  fetchingBestRoute,
  outputUsdValue,
  inputUsdValue,
  swapButtonTitle,
  onChainClick,
  onTokenClick,
  connectedWallets,
  errorMessage,
  hasLimitError,
  isSending,
  swap,
  fromAmountRangeError,
  recommendation,
  percentageChange,
  tokenBalanceReal,
  tokenBalance,
  swapFromAmount,
  showPercentageChange,
}: HomePanelProps) {
  const { getSigners } = useWallets();
  const [txHash, setTxHash] = useState<string>();

  const sendTx = async (type: TransactionType) => {
    const signer = getSigners(connectedWallets[0].walletType).getSigner(type);
    const signerAddress = await signer.signer.getAddress();
    useTransactionStore.setState({ isSending: true });

    if (type === "EVM") {
      try {
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
          useTransactionStore.setState({ isSending: false });
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

        const publicKey = signer.provider.publicKey.pubkey
          ? signer.provider.publicKey.pubkey
          : signer.provider._publicKey.toString();

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
        const sig = await signer.signTransaction(transaction);
        const raw = sig.serialize();
        const signature = await connection.sendRawTransaction(raw);
        if (signature) {
          setTxHash(signature);
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
          .signAndSubmitTransaction(transaction); // same as below

        // const pendingTransaction = await (
        //   window as any
        // ).bitkeep.aptos.signAndSubmitTransaction(transaction);

        if (pendingTransaction.hash) {
          setTxHash(pendingTransaction.hash);
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
          <TokenInfo
            type="From"
            chain={fromChain}
            token={fromToken}
            onAmountChange={setInputAmount}
            inputAmount={inputAmount}
            fromChain={fromChain}
            toChain={toChain}
            loadingStatus={loadingStatus}
            inputUsdValue={inputUsdValue}
            fromToken={fromToken}
            setInputAmount={setInputAmount}
            connectedWallets={connectedWallets}
            bestRoute={bestRoute}
            fetchingBestRoute={fetchingBestRoute}
            onChainClick={() => onChainClick("from-chain")}
            onTokenClick={() => onTokenClick("from-token")}
            tokenBalanceReal={tokenBalanceReal}
            tokenBalance={tokenBalance}
          />
        </>
      </FromContainer>
      <TokenInfo
        type="To"
        chain={toChain}
        token={toToken}
        outputAmount={outputAmount}
        percentageChange={percentageChange}
        outputUsdValue={outputUsdValue}
        fromChain={fromChain}
        toChain={toChain}
        loadingStatus={loadingStatus}
        inputUsdValue={inputUsdValue}
        fromToken={fromToken}
        setInputAmount={setInputAmount}
        connectedWallets={connectedWallets}
        inputAmount={inputAmount}
        bestRoute={bestRoute}
        fetchingBestRoute={fetchingBestRoute}
        onChainClick={() => onChainClick("to-chain")}
        onTokenClick={() => onTokenClick("to-token")}
        tokenBalanceReal={tokenBalanceReal}
        tokenBalance={tokenBalance}
        showPercentageChange={showPercentageChange}
      />

      {(errorMessage || hasLimitError(bestRoute)) && (
        <Alerts>
          {errorMessage && <Alert type="error">{errorMessage}</Alert>}
          {hasLimitError(bestRoute) && (
            <Alert type="error" title={`${swap?.swapperId} Limit`}>
              <>
                <Typography variant="body2">
                  {`${fromAmountRangeError}, Yours: ${swapFromAmount} ${swap?.from.symbol}`}
                </Typography>
                <Typography variant="body2">{recommendation}</Typography>
              </>
            </Alert>
          )}
        </Alerts>
      )}
      <Footer>
        {fromChain?.info?.transactionUrl && txHash ? (
          <Alert type="success">
            <div style={{ fontSize: "small", overflowWrap: "anywhere" }}>
              Success:{" "}
              <a
                style={{ color: "#0000ff" }}
                target={"_blank"}
                href={fromChain?.info?.transactionUrl + txHash}
              >
                {txHash}
              </a>
            </div>
          </Alert>
        ) : (
          <Alert type="success">
            <p style={{ fontSize: "small", overflowWrap: "anywhere" }}>
              {txHash}
            </p>
          </Alert>
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
