import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTransaction, useTransactionStore } from "../store/transaction";
import { navigationRoutes } from "../constants/navigationRoutes";
import { useMetaStore } from "../store/meta";
import { useWalletsStore } from "../store/wallets";
import { errorMessages } from "../constants/errors";
import {
  getSwapButtonState,
  hasLimitError,
  LimitErrorMessage,
  getTotalFeeInUsd,
  hasHighFee,
  getPercentageChange,
} from "../utils/swap";
import { useUiStore } from "../store/ui";
import {
  numberToString,
  secondsToString,
  totalArrivalTime,
} from "../utils/numbers";
import { getBalanceFromWallet } from "../utils/wallets";
import { getFormatedBestRoute } from "../utils/routing";
import BigNumber from "bignumber.js";
import { HomePanel } from "../containers";

export function Home() {
  const navigate = useNavigate();
  const fromChain = useTransactionStore.use.fromChain();
  const fromToken = useTransactionStore.use.fromToken();
  const toChain = useTransactionStore.use.toChain();
  const toToken = useTransactionStore.use.toToken();
  const toAddress = useTransactionStore.use.toAddress();
  const setInputAmount = useTransactionStore.use.setInputAmount();
  const inputUsdValue = useTransactionStore.use.inputUsdValue();
  const inputAmount = useTransactionStore.use.inputAmount();
  const isSending = useTransactionStore.use.isSending();
  const outputAmount = useTransactionStore.use.outputAmount();
  const outputUsdValue = useTransactionStore.use.outputUsdValue();
  const bestRoute = useTransactionStore.use.bestRoute();
  const tokens = useMetaStore.use.meta().tokens;
  const fetchingBestRoute = useTransactionStore.use.loading();
  const bestRouteError = useTransactionStore.use.error();
  const loadingMetaStatus = useMetaStore.use.loadingStatus();
  const connectedWallets = useWalletsStore.use.connectedWallets();
  const setCurrentPage = useUiStore.use.setCurrentPage();

  const errorMessage =
    loadingMetaStatus === "failed"
      ? errorMessages.genericServerError
      : bestRouteError;

  const showBestRoute =
    !!inputAmount && (!!bestRoute || fetchingBestRoute || !!bestRouteError);

  const { fromAmountRangeError, recommendation, swap } =
    LimitErrorMessage(bestRoute);

  const swapButtonState = getSwapButtonState(
    loadingMetaStatus,
    connectedWallets,
    isSending, // loading
    inputAmount,
    fromChain,
    fromToken,
    toAddress
  );

  const totalFeeInUsd = getTotalFeeInUsd(bestRoute, tokens);

  const highFee = hasHighFee(totalFeeInUsd);

  const tokenBalance =
    !!fromChain && !!fromToken
      ? numberToString(
          getBalanceFromWallet(
            connectedWallets,
            fromChain?.name,
            fromToken?.symbol,
            fromToken?.address
          )?.amount || "0",
          8
        )
      : "0";

  const tokenBalanceReal =
    !!fromChain && !!fromToken
      ? numberToString(
          getBalanceFromWallet(
            connectedWallets,
            fromChain?.name,
            fromToken?.symbol,
            fromToken?.address
          )?.amount || "0",
          getBalanceFromWallet(
            connectedWallets,
            fromChain?.name,
            fromToken?.symbol,
            fromToken?.address
          )?.decimal
        )
      : "0";

  useEffect(() => {
    setCurrentPage(navigationRoutes.home);

    return setCurrentPage.bind(null, "");
  }, []);

  const percentageChange =
    !inputUsdValue || !outputUsdValue || !outputUsdValue.gt(0)
      ? null
      : getPercentageChange(
          inputUsdValue.toNumber(),
          outputUsdValue.toNumber()
        );

  return (
    <HomePanel
      bestRoute={bestRoute}
      bestRouteError={bestRouteError}
      fetchTransaction={fetchTransaction}
      onClickHistory={() => navigate(navigationRoutes.swaps)}
      onClickSettings={() => navigate(navigationRoutes.settings)}
      setInputAmount={setInputAmount}
      fromChain={fromChain}
      toChain={toChain}
      toAddress={toAddress}
      fromToken={fromToken}
      toToken={toToken}
      outputAmount={
        outputAmount
          ? numberToString(new BigNumber(outputAmount))
          : numberToString(new BigNumber(0))
      }
      inputAmount={inputAmount}
      isSending={isSending}
      loadingStatus={loadingMetaStatus}
      showBestRoute={showBestRoute}
      fetchingBestRoute={fetchingBestRoute}
      outputUsdValue={numberToString(outputUsdValue)}
      inputUsdValue={numberToString(inputUsdValue)}
      swapButtonTitle={swapButtonState.title}
      swapButtonDisabled={swapButtonState.disabled}
      swapButtonClick={() => {
        if (swapButtonState.title === "Connect Wallet")
          navigate(navigationRoutes.wallets);
        else {
          navigate(navigationRoutes.confirmSwap, { replace: true });
        }
      }}
      onChainClick={(route) => {
        navigate(route);
      }}
      onTokenClick={(route) => {
        navigate(route);
      }}
      // targetNetworkName={targetNetworkName}
      highFee={highFee}
      errorMessage={errorMessage}
      hasLimitError={hasLimitError}
      swap={swap}
      fromAmountRangeError={fromAmountRangeError}
      recommendation={recommendation}
      totalFeeInUsd={numberToString(totalFeeInUsd, 0, 2)}
      connectedWallets={connectedWallets}
      percentageChange={numberToString(percentageChange, 0, 2)}
      showPercentageChange={!!percentageChange?.lt(0)}
      tokenBalanceReal={tokenBalanceReal}
      tokenBalance={tokenBalance}
      totalTime={secondsToString(totalArrivalTime(bestRoute))}
      bestRouteData={getFormatedBestRoute(bestRoute)}
      swapFromAmount={numberToString(swap?.fromAmount || null)}
      swithFromAndToComponent={undefined}
    />
  );
}
