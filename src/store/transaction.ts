import { create } from "zustand";
import BigNumber from "bignumber.js";
import { ZERO } from "../constants/numbers";
import {
  getBestRouteToTokenUsdPrice,
  isRouteParametersChanged,
} from "../utils/routing";
import createSelectors from "./selectors";
import { subscribeWithSelector } from "zustand/middleware";
import { calcOutputUsdValue } from "../utils/swap";
import { useMetaStore } from "./meta";
import {
  getDefaultToken,
  getSortedTokens,
  tokensAreEqual,
} from "../utils/wallets";
import { useWalletsStore } from "./wallets";
import { TokenWithBalance } from "../pages/SelectTokenPage";
import { isPositiveNumber } from "../utils/numbers";
import { RegistryNetworkName } from "mycel-client-ts/mycel.resolver/rest";
import { BestRouteResponse, BlockchainMeta, Token } from "../types/api/main";

const getUsdValue = (token: Token | null, amount: string): BigNumber | null =>
  token?.usdPrice
    ? new BigNumber(amount || ZERO).multipliedBy(token?.usdPrice || 0)
    : null;

//Todo: fix/refactor-fromで削除されたstateの影響でautoConnectが動かなくなっていたので、一旦restore
export interface TransactionState {
  fromChain: BlockchainMeta | null;
  toChain: BlockchainMeta | null;
  toAddress: string | null;
  inputAmount: string;
  domainName: string;
  inputUsdValue: BigNumber | null;
  outputAmount: BigNumber | null;
  outputUsdValue: BigNumber | null;
  fromToken: TokenWithBalance | null;
  toToken: TokenWithBalance | null;
  targetNetworkName: RegistryNetworkName | null;
  isSending: boolean;
  loading: boolean;
  error: string;
  sourceTokens: Token[];
  fromTokens: Token[];
  destinationTokens: Token[];
  setTargetNetworkName: (chain: RegistryNetworkName) => void;
  setToAddress: (address: string) => void;
  resetRoute: () => void;
  setFromChain: (
    chain: BlockchainMeta | null,
    setDefaultToken?: boolean
  ) => void;
  setToChain: (chian: BlockchainMeta | null, setDefaultToken?: boolean) => void;
  setFromToken: (token: Token | null) => void;
  setToToken: (token: Token | null) => void;
  setInputAmount: (amount: string) => void;
  setDomainName: (domainName: string) => void;
  bestRoute: BestRouteResponse | null;
  setBestRoute: (bestRoute: BestRouteResponse | null) => void;
  retry: (pendingSwap: any) => void;
  switchFromAndTo: () => void;
}

export const useTransactionStore = createSelectors(
  create<TransactionState>()(
    subscribeWithSelector((set) => ({
      fromChain: null,
      fromToken: null,
      inputAmount: "",
      domainName: "",
      outputAmount: null,
      targetNetworkName: null,
      inputUsdValue: new BigNumber(0),
      outputUsdValue: new BigNumber(0),
      toChain: null,
      toToken: null,
      toAddress: null,
      bestRoute: null,
      isSending: false,
      loading: false,
      error: "",
      sourceTokens: [],
      fromTokens: [],
      destinationTokens: [],
      setBestRoute: (bestRoute) =>
        set((state) => {
          let outputAmount: BigNumber | null = null;
          let outputUsdValue: BigNumber = ZERO;
          if (!isPositiveNumber(state.inputAmount)) return {};
          if (!!bestRoute) {
            outputAmount = !!bestRoute.result?.outputAmount
              ? new BigNumber(bestRoute.result?.outputAmount)
              : null;
            outputUsdValue = calcOutputUsdValue(
              bestRoute.result?.outputAmount,
              getBestRouteToTokenUsdPrice(bestRoute) || state.toToken?.usdPrice
            );
          }
          return {
            bestRoute,
            ...(!!bestRoute && {
              outputAmount,
              outputUsdValue,
            }),
          };
        }),
      resetRoute: () =>
        set(() => ({
          loading: true,
          error: "",
          bestRoute: null,
          outputAmount: null,
          outputUsdValue: new BigNumber(0),
        })),
      setFromChain: (chain, setDefaultToken) => {
        set((state) => {
          if (state.fromChain?.name === chain?.name) return {};
          const tokens = useMetaStore.getState().meta.tokens;
          const connectedWallets = useWalletsStore.getState().connectedWallets;
          const sortedTokens = getSortedTokens(
            chain,
            tokens,
            connectedWallets,
            state.destinationTokens
          );
          const fromToken = getDefaultToken(sortedTokens, state.toToken);
          return {
            fromChain: chain,
            fromTokens: sortedTokens,
            sourceTokens: sortedTokens,
            ...(setDefaultToken && {
              fromToken,
            }),
            ...(!!state.inputAmount && {
              inputUsdValue: getUsdValue(fromToken, state.inputAmount),
            }),
          };
        });
      },
      setFromToken: (token) =>
        set((state) => ({
          fromToken: token,
          ...(!!state.inputAmount && {
            inputUsdValue: getUsdValue(token, state.inputAmount),
          }),
        })),
      setToChain: (chain, setDefaultToken) => {
        set((state) => {
          if (state.toChain?.name === chain?.name) return {};
          const tokens = useMetaStore.getState().meta.tokens;
          const connectedWallets = useWalletsStore.getState().connectedWallets;
          const sortedTokens = getSortedTokens(
            chain,
            tokens,
            connectedWallets,
            state.destinationTokens
          );
          return {
            toChain: chain,
            destinationTokens: sortedTokens,
            ...(setDefaultToken && {
              toToken: getDefaultToken(sortedTokens, state.fromToken),
            }),
          };
        });
      },
      setToToken: (token) =>
        set(() => ({
          toToken: token,
        })),
      setTargetNetworkName: (chain) =>
        set(() => ({
          targetNetworkName: chain,
        })),
      setToAddress: (address) =>
        set(() => ({
          toAddress: address,
        })),
      setDomainName: (domain) =>
        set(() => ({
          domainName: domain,
        })),
      setInputAmount: (amount) => {
        set((state) => ({
          inputAmount: amount,
          ...(!amount && {
            outputAmount: new BigNumber(0),
            outputUsdValue: new BigNumber(0),
            bestRoute: null,
            error: "",
          }),
          ...(!!state.fromToken && {
            inputUsdValue: getUsdValue(state.fromToken, amount),
          }),
        }));
      },
      retry: (pendingSwap) => {
        const { tokens, blockchains } = useMetaStore.getState().meta;
        const connectedWallets = useWalletsStore.getState().connectedWallets;
        const failedIndex =
          pendingSwap.status === "failed"
            ? pendingSwap.steps.findIndex(
                (s: { status: string }) => s.status === "failed"
              )
            : null;

        if (failedIndex === null || failedIndex < 0) return;

        const firstStep = pendingSwap.steps[0];
        const lastStep = pendingSwap.steps[pendingSwap.steps.length - 1];
        const fromChain =
          blockchains.find(
            (blockchain) => blockchain.name === firstStep.fromBlockchain
          ) || null;
        const toChain =
          blockchains.find(
            (blockchain) => blockchain.name === lastStep.toBlockchain
          ) || null;

        const fromToken = tokens.find((token) =>
          tokensAreEqual(token, {
            blockchain: firstStep.fromBlockchain,
            symbol: firstStep.fromSymbol,
            address: firstStep.fromSymbolAddress,
          })
        );

        const toToken = tokens.find((token) =>
          tokensAreEqual(token, {
            blockchain: lastStep.toBlockchain,
            symbol: lastStep.toSymbol,
            address: lastStep.toSymbolAddress,
          })
        );
        const sortedSourceTokens = getSortedTokens(
          fromChain,
          tokens,
          connectedWallets,
          []
        );
        const sortedDestinationTokens = getSortedTokens(
          toChain,
          tokens,
          connectedWallets,
          []
        );
        const inputAmount = pendingSwap.inputAmount;
        set({
          fromChain,
          fromToken,
          inputAmount,
          outputAmount: null,
          inputUsdValue: getUsdValue(fromToken || null, inputAmount),
          outputUsdValue: new BigNumber(0),
          toChain,
          toToken,
          bestRoute: null,
          loading: false,
          error: "",
          sourceTokens: sortedSourceTokens,
          destinationTokens: sortedDestinationTokens,
        });
      },
      switchFromAndTo: () =>
        set((state) => ({
          fromChain: state.toChain,
          fromToken: state.toToken,
          toChain: state.fromChain,
          toToken: state.fromToken,
          sourceTokens: state.destinationTokens,
          destinationTokens: state.sourceTokens,
          inputAmount: state.outputAmount?.toString() || "",
          inputUsdValue: getUsdValue(
            state.toToken,
            state.outputAmount?.toString() || ""
          ),
        })),
    }))
  )
);

const transactionState = (trasactionStore: typeof useTransactionStore) => {
  let abortController: AbortController | null = null;
  const fetchTransaction = () => {
    const {
      fromToken,
      toToken,
      inputAmount,
      resetRoute,
    } = trasactionStore.getState();
    if (!fromToken || !toToken || !isPositiveNumber(inputAmount)) return;
    abortController?.abort();
    abortController = new AbortController();

    if (!trasactionStore.getState().loading) {
      resetRoute();
    }
  };

  const bestRouteParamsListener = () => {
    const {
      fromToken,
      toToken,
      inputAmount,
      inputUsdValue,
    } = useTransactionStore.getState();
    if (!isPositiveNumber(inputAmount) || inputUsdValue?.eq(0))
      return trasactionStore.setState({ loading: false });

    if (tokensAreEqual(fromToken, toToken))
      return trasactionStore.setState({
        loading: false,
        bestRoute: null,
        outputAmount: new BigNumber(inputAmount),
        outputUsdValue: inputUsdValue,
      });
  };

  useTransactionStore.subscribe(
    (state) => ({
      fromChain: state.fromChain,
      fromToken: state.fromToken,
      targetChain: state.targetNetworkName,
      toChain: state.toChain,
      toToken: state.toToken,
      inputAmount: state.inputAmount,
    }),
    bestRouteParamsListener,
    {
      equalityFn: (prevState, currentState) => {
        if (
          isRouteParametersChanged({
            store: "bestRoute",
            prevState,
            currentState,
          })
        )
          return false;
        else return true;
      },
    }
  );

  return { fetchTransaction };
};

export const { fetchTransaction } = transactionState(useTransactionStore);
