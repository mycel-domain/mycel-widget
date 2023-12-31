import BigNumber from "bignumber.js";
import { ConnectedWallet } from "../store/wallets";
import { ZERO } from "../constants/numbers";
import { numberToString } from "./numbers";
import { WalletType } from "../wallets/shared";
import { getRequiredBalanceOfWallet } from "./routing";
import { getRequiredChains } from "./wallets";
import { LoadingStatus } from "../store/meta";
import {
  BlockchainMeta,
  PendingSwapNetworkStatus,
  PendingSwapStep,
  SwapButtonState,
  Wallet,
} from "../types";
import { removeDuplicateFrom } from "./common";
import { TokenWithBalance } from "../types/meta";
import {
  BestRouteRequest,
  BestRouteResponse,
  RecommendedSlippage,
  SwapResult,
  Token,
} from "../types/api/main";

export function getOutputRatio(
  inputUsdValue: BigNumber | null,
  outputUsdValue: BigNumber | null
) {
  if (
    !inputUsdValue ||
    !outputUsdValue ||
    inputUsdValue.lte(ZERO) ||
    outputUsdValue.lte(ZERO)
  )
    return 0;
  return outputUsdValue.div(inputUsdValue).minus(1).multipliedBy(100);
}

export function outputRatioHasWarning(
  inputUsdValue: BigNumber | null,
  outputRatio: BigNumber | 0
): boolean {
  return (
    ((parseInt(outputRatio.toFixed(2) || "0") <= -10 &&
      inputUsdValue?.gte(new BigNumber(400))) ||
      (parseInt(outputRatio.toFixed(2) || "0") <= -5 &&
        inputUsdValue?.gte(new BigNumber(1000)))) ??
    false
  );
}

export function hasLimitError(bestRoute: BestRouteResponse | null): boolean {
  return (
    (bestRoute?.result?.swaps || []).filter((swap) => {
      const minimum = !!swap.fromAmountMinValue
        ? new BigNumber(swap.fromAmountMinValue)
        : null;
      const maximum = !!swap.fromAmountMaxValue
        ? new BigNumber(swap.fromAmountMaxValue)
        : null;
      const isExclusive = swap.fromAmountRestrictionType === "EXCLUSIVE";
      if (isExclusive) {
        return minimum?.gte(swap.fromAmount) || maximum?.lte(swap.fromAmount);
      } else {
        return minimum?.gt(swap.fromAmount) || maximum?.lt(swap.fromAmount);
      }
    }).length > 0
  );
}

export function LimitErrorMessage(bestRoute: BestRouteResponse | null): {
  swap: SwapResult | null;
  fromAmountRangeError: string;
  recommendation: string;
} {
  if (!bestRoute)
    return { swap: null, fromAmountRangeError: "", recommendation: "" };
  const swap = (bestRoute?.result?.swaps || []).filter((swap) => {
    const minimum = !!swap.fromAmountMinValue
      ? new BigNumber(swap.fromAmountMinValue)
      : null;
    const maximum = !!swap.fromAmountMaxValue
      ? new BigNumber(swap.fromAmountMaxValue)
      : null;
    const isExclusive = swap.fromAmountRestrictionType === "EXCLUSIVE";
    if (isExclusive) {
      return minimum?.gte(swap.fromAmount) || maximum?.lte(swap.fromAmount);
    } else {
      return minimum?.gt(swap.fromAmount) || maximum?.lt(swap.fromAmount);
    }
  })[0];
  if (!swap)
    return { swap: null, fromAmountRangeError: "", recommendation: "" };
  const minimum = !!swap.fromAmountMinValue
    ? new BigNumber(swap.fromAmountMinValue)
    : null;
  const maximum = !!swap.fromAmountMaxValue
    ? new BigNumber(swap.fromAmountMaxValue)
    : null;
  const isExclusive = swap.fromAmountRestrictionType === "EXCLUSIVE";

  let fromAmountRangeError = "";
  let recommendation = "";
  if (!isExclusive && !!minimum && minimum.gt(swap.fromAmount)) {
    fromAmountRangeError = `Required: >= ${numberToString(minimum)} ${
      swap.from.symbol
    }`;
    recommendation = "Increase your swap amount";
  } else if (isExclusive && !!minimum && minimum.gte(swap.fromAmount)) {
    fromAmountRangeError = `Required: > ${numberToString(minimum)} ${
      swap.from.symbol
    }`;
    recommendation = "Increase your swap amount";
  }

  if (!isExclusive && !!maximum && maximum.lt(swap.fromAmount)) {
    fromAmountRangeError = `Required: <= ${numberToString(maximum)} ${
      swap.from.symbol
    }`;
    recommendation = "Decrease your swap amount";
  } else if (isExclusive && !!maximum && maximum.lte(swap.fromAmount)) {
    fromAmountRangeError = `Required: < ${numberToString(maximum)} ${
      swap.from.symbol
    }`;
    recommendation = "Decrease your swap amount";
  }

  return { swap, fromAmountRangeError, recommendation };
}

export function getSwapButtonState(
  loadingMetaStatus: LoadingStatus,
  connectedWallets: ConnectedWallet[],
  loading: boolean,
  inputAmount: string,
  fromChain: BlockchainMeta | null,
  fromToken: TokenWithBalance | null,
  toAddress: string | null
): SwapButtonState {
  if (loadingMetaStatus !== "success")
    return { title: "Connect Wallet", disabled: true };
  if (connectedWallets.length == 0)
    return { title: "Connect Wallet", disabled: true };
  if (loading) return { title: "Sending token...", disabled: true };
  else if (!fromChain || !fromToken)
    return { title: "Select chain and token", disabled: true };
  else if (!toAddress) return { title: "Search domain ", disabled: true };
  else if (!inputAmount || inputAmount === "0")
    return { title: "Enter an amount", disabled: true };
  else return { title: "Send", disabled: false };
}

export function canComputePriceImpact(
  bestRoute: BestRouteResponse | null,
  inputAmount: string,
  inputUsdValue: BigNumber | null,
  outputUsdValue: BigNumber | null
) {
  return !(
    (!inputUsdValue ||
      !outputUsdValue ||
      inputUsdValue.lte(ZERO) ||
      outputUsdValue.lte(ZERO)) &&
    !!bestRoute?.result &&
    !!inputAmount &&
    inputAmount !== "0" &&
    parseFloat(inputAmount || "0") !== 0 &&
    !!bestRoute.result
  );
}

export function requiredWallets(route: BestRouteResponse | null) {
  const wallets: string[] = [];

  route?.result?.swaps.forEach((swap) => {
    const currentStepFromBlockchain = swap.from.blockchain;
    const currentStepToBlockchain = swap.to.blockchain;
    let lastAddedWallet = wallets[wallets.length - 1];
    if (currentStepFromBlockchain != lastAddedWallet)
      wallets.push(currentStepFromBlockchain);
    lastAddedWallet = wallets[wallets.length - 1];
    if (currentStepToBlockchain != lastAddedWallet)
      wallets.push(currentStepToBlockchain);
  });
  return wallets;
}

export const getUsdPrice = (
  blockchain: string,
  symbol: string,
  address: string | null,
  allTokens: Token[]
): number | null => {
  const token = allTokens?.find(
    (t) =>
      t.blockchain === blockchain &&
      t.symbol?.toUpperCase() === symbol?.toUpperCase() &&
      t.address === address
  );
  return token?.usdPrice || null;
};

export function getUsdFeeOfStep(
  step: SwapResult,
  allTokens: Token[]
): BigNumber {
  let totalFeeInUsd = ZERO;
  for (let i = 0; i < step.fee.length; i++) {
    const fee = step.fee[i];
    if (fee.expenseType === "DECREASE_FROM_OUTPUT") continue;

    const unitPrice = getUsdPrice(
      fee.asset.blockchain,
      fee.asset.symbol,
      fee.asset.address,
      allTokens
    );
    totalFeeInUsd = totalFeeInUsd.plus(
      new BigNumber(fee.amount).multipliedBy(unitPrice || 0)
    );
  }

  return totalFeeInUsd;
}

export function getTotalFeeInUsd(
  bestRoute: BestRouteResponse | null,
  allTokens: Token[]
): BigNumber | null {
  return (
    bestRoute?.result?.swaps.reduce(
      (totalFee: BigNumber, step) =>
        totalFee.plus(getUsdFeeOfStep(step, allTokens)),
      ZERO
    ) || null
  );
}

export function hasHighFee(totalFeeInUsd: BigNumber | null) {
  if (!totalFeeInUsd) return false;
  return !totalFeeInUsd.lt(new BigNumber(30));
}

export function hasSlippageError(
  slippages: (RecommendedSlippage | null)[] | undefined
) {
  return (slippages?.filter((s) => !!s?.error)?.length || 0) > 0;
}

export function getMinRequiredSlippage(
  route: BestRouteResponse
): string | null {
  const slippages = route.result?.swaps.map(
    (slippage) => slippage.recommendedSlippage
  );
  return (
    slippages
      ?.map((s) => s?.slippage || "0")
      ?.filter((s) => parseFloat(s) > 0)
      ?.sort((a, b) => parseFloat(b) - parseFloat(a))
      ?.find(() => true) || null
  );
}

export function hasProperSlippage(
  userSlippage: string,
  minRequiredSlippage: string | null
) {
  if (!minRequiredSlippage) return true;
  return parseFloat(userSlippage) >= parseFloat(minRequiredSlippage);
}

export function hasEnoughBalance(
  route: BestRouteResponse,
  selectedWallets: Wallet[]
) {
  const fee = route.validationStatus;

  if (fee === null || fee.length === 0) return true;

  for (const wallet of selectedWallets) {
    const requiredAssets = getRequiredBalanceOfWallet(wallet, fee);
    if (!requiredAssets) continue;

    const enoughBalanceInWallet = requiredAssets
      .map((asset) => asset.ok)
      .reduce((previous, current) => previous && current);
    if (!enoughBalanceInWallet) return false;
  }

  return true;
}

export function hasEnoughBalanceAndProperSlippage(
  route: BestRouteResponse,
  selectedWallets: Wallet[],
  userSlippage: string,
  minRequiredSlippage: string | null
): boolean {
  return (
    hasEnoughBalance(route, selectedWallets) &&
    hasProperSlippage(userSlippage, minRequiredSlippage)
  );
}

export function createBestRouteRequestBody(
  fromToken: Token,
  toToken: Token,
  inputAmount: string,
  wallets: ConnectedWallet[],
  selectedWallets: Wallet[],
  disabledLiquiditySources: string[],
  slippage: number,
  affiliateRef: string | null,
  affiliatePercent: number | null,
  affiliateWallets: { [key: string]: string } | null,
  initialRoute?: BestRouteResponse,
  destination?: string
): BestRouteRequest {
  const selectedWalletsMap = selectedWallets.reduce(
    (
      selectedWalletsMap: BestRouteRequest["selectedWallets"],
      selectedWallet
    ) => (
      (selectedWalletsMap[selectedWallet.chain] = selectedWallet.address),
      selectedWalletsMap
    ),
    {}
  );

  const connectedWallets: BestRouteRequest["connectedWallets"] = [];

  wallets.forEach((wallet) => {
    const chainAndAccounts = connectedWallets.find(
      (connectedWallet) => connectedWallet.blockchain === wallet.chain
    );
    if (!!chainAndAccounts) chainAndAccounts.addresses.push(wallet.address);
    else
      connectedWallets.push({
        blockchain: wallet.chain,
        addresses: [wallet.address],
      });
  });

  const checkPrerequisites = !!initialRoute;

  const filteredBlockchains = removeDuplicateFrom(
    (initialRoute?.result?.swaps || []).reduce(
      (blockchains: string[], swap) => {
        blockchains.push(swap.from.blockchain, swap.to.blockchain);
        // Check if internalSwaps array exists
        if (swap.internalSwaps && Array.isArray(swap.internalSwaps)) {
          swap.internalSwaps.map((internalSwap) => {
            blockchains.push(
              internalSwap.from.blockchain,
              internalSwap.to.blockchain
            );
          });
        }
        return blockchains;
      },
      []
    )
  );

  const requestBody: BestRouteRequest = {
    amount: inputAmount.toString(),
    affiliateRef: affiliateRef ?? undefined,
    affiliatePercent: affiliatePercent ?? undefined,
    affiliateWallets: affiliateWallets ?? undefined,
    checkPrerequisites,
    from: {
      address: fromToken.address,
      blockchain: fromToken.blockchain,
      symbol: fromToken.symbol,
    },
    to: {
      address: toToken.address,
      blockchain: toToken.blockchain,
      symbol: toToken.symbol,
    },
    connectedWallets,
    destination: destination || undefined,
    selectedWallets: selectedWalletsMap,
    swapperGroups: disabledLiquiditySources,
    swappersGroupsExclude: true,
    slippage: slippage.toString(),
    ...(checkPrerequisites && { blockchains: filteredBlockchains }),
  };

  return requestBody;
}

export function getWalletsForNewSwap(selectedWallets: Wallet[]) {
  const wallets = selectedWallets.reduce(
    (
      selectedWalletsMap: {
        [p: string]: { address: string; walletType: WalletType };
      },
      selectedWallet
    ) => (
      (selectedWalletsMap[selectedWallet.chain] = {
        address: selectedWallet.address,
        walletType: selectedWallet.walletType,
      }),
      selectedWalletsMap
    ),
    {}
  );

  return wallets;
}

export function getRouteOutputAmount(route: BestRouteResponse | null) {
  return route?.result?.outputAmount || null;
}

export function getPercentageChange(
  oldValue: string | number | null,
  newValue: string | number | null
) {
  if (!oldValue || !newValue) return null;
  return new BigNumber(newValue)
    .div(new BigNumber(oldValue))
    .minus(1)
    .multipliedBy(100);
}

export function isOutputAmountChangedALot(
  oldRoute: BestRouteResponse,
  newRoute: BestRouteResponse
) {
  const oldOutputAmount = getRouteOutputAmount(oldRoute);
  const newOutputAmount = getRouteOutputAmount(newRoute);
  if (!oldOutputAmount || !newOutputAmount) return false;
  const percentageChange = getPercentageChange(
    oldOutputAmount,
    newOutputAmount
  );
  if (!percentageChange) return true;

  return percentageChange.toNumber() <= -1;
}

export function getBalanceWarnings(
  route: BestRouteResponse,
  selectedWallets: Wallet[]
) {
  const fee = route.validationStatus;
  const requiredWallets = getRequiredChains(route);
  const walletsSortedByRequiredWallets = selectedWallets.sort(
    (selectedWallet1, selectedWallet2) =>
      requiredWallets.indexOf(selectedWallet1.chain) -
      requiredWallets.indexOf(selectedWallet2.chain)
  );
  return walletsSortedByRequiredWallets
    .flatMap((wallet) => getRequiredBalanceOfWallet(wallet, fee) || [])
    .filter((asset) => !asset.ok)
    .map((asset) => {
      const symbol = asset.asset.symbol;
      const currentAmount = numberToString(
        new BigNumber(asset.currentAmount.amount).shiftedBy(
          -asset.currentAmount.decimals
        ),
        8
      );
      const requiredAmount = numberToString(
        new BigNumber(asset.requiredAmount.amount).shiftedBy(
          -asset.requiredAmount.decimals
        ),
        8
      );
      let reason = "";
      if (asset.reason === "FEE") reason = " for network fee";
      if (asset.reason === "INPUT_ASSET") reason = " for swap";
      if (asset.reason === "FEE_AND_INPUT_ASSET")
        reason = " for input and network fee";
      const warningMessage = `Needs ≈ ${requiredAmount} ${symbol}${reason}, but you have ${currentAmount} ${symbol} in your ${asset.asset.blockchain} wallet.`;
      return warningMessage;
    });
}

export function calcOutputUsdValue(
  outputAmount?: string,
  tokenPrice?: number | null
) {
  const amount = !!outputAmount ? new BigNumber(outputAmount) : ZERO;

  return amount.multipliedBy(tokenPrice || 0);
}

export function isNetworkStatusInWarningState(
  pendingSwapStep: PendingSwapStep | null
): boolean {
  return (
    !!pendingSwapStep &&
    pendingSwapStep.networkStatus !== null &&
    pendingSwapStep.networkStatus !== PendingSwapNetworkStatus.NetworkChanged
  );
}
