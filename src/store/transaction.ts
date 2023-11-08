import { create } from "zustand";
import BigNumber from "bignumber.js";
import { ZERO } from "../constants/numbers";
import {
  isRouteParametersChanged,
} from "../utils/routing";
import createSelectors from "./selectors";
import { subscribeWithSelector } from "zustand/middleware";
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
import { BlockchainMeta, Token } from "../types/api/main";

const getUsdValue = (token: Token | null, amount: string): BigNumber | null =>
  token?.usdPrice
    ? new BigNumber(amount || ZERO).multipliedBy(token?.usdPrice || 0)
    : null;

export interface TransactionState {
  fromChain: BlockchainMeta | null;
  fromToken: TokenWithBalance | null;
  toAddress: string | null;
  inputAmount: string;
  targetNetworkName: RegistryNetworkName | null;
  domainName: string;
  isSending: boolean;
  loading: boolean;
  error: string;
  fromTokens: Token[];
  setTargetNetworkName: (chain: RegistryNetworkName) => void;
  setToAddress: (address: string) => void;
  setFromChain: (
    chain: BlockchainMeta | null,
    setDefaultToken?: boolean
  ) => void;
  setDomainName: (domainName: string) => void;
  setFromToken: (token: Token | null) => void;
  setInputAmount: (amount: string) => void;
}

export const useTransactionStore = createSelectors(
  create<TransactionState>()(
    subscribeWithSelector((set) => ({
      fromChain: null,
      fromToken: null,
      inputAmount: "",
      outputAmount: null,
      targetNetworkName: null,
      domainName: "",
      inputUsdValue: new BigNumber(0),
      outputUsdValue: new BigNumber(0),
      toChain: null,
      toToken: null,
      toAddress: null,
      bestRoute: null,
      isSending: false,
      loading: false,
      error: "",
      fromTokens: [],
      setFromChain: (chain, setDefaultToken) => {
        set((state) => {
          if (state.fromChain?.name === chain?.name) return {};
          const tokens = useMetaStore.getState().meta.tokens;
          const connectedWallets = useWalletsStore.getState().connectedWallets;
          const sortedTokens = getSortedTokens(
            chain,
            tokens,
            connectedWallets,
          );
          const fromToken = getDefaultToken(sortedTokens);
          return {
            fromChain: chain,
            fromTokens: sortedTokens,
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
      setTargetNetworkName: (chain) =>
        set(() => ({
          targetNetworkName: chain,
        })),
      setDomainName: (domainName) =>
        set(() => ({
          domainName: domainName,
        })),
      setToAddress: (address) =>
        set(() => ({
          toAddress: address,
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
    }))
  )
);

const transactionState = (trasactionStore: typeof useTransactionStore) => {
  let abortController: AbortController | null = null;
  const fetchTransaction = () => {
    const { fromToken, inputAmount, } =
      trasactionStore.getState();
    if (!fromToken || !isPositiveNumber(inputAmount)) return;
    abortController?.abort();
    abortController = new AbortController();

  };

  const bestRouteParamsListener = () => {
    const { inputAmount } = useTransactionStore.getState();
    if (!isPositiveNumber(inputAmount))
      return trasactionStore.setState({ loading: false });

    return trasactionStore.setState({
      loading: false,
    });
  };

  useTransactionStore.subscribe(
    (state) => ({
      fromChain: state.fromChain,
      fromToken: state.fromToken,
      targetChain: state.targetNetworkName,
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
