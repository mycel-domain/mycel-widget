import { WalletType } from "../wallets/shared";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import {
  getRequiredChains,
  getTokensWithBalance,
  isAccountAndWalletMatched,
  sortTokens,
} from "../utils/wallets";
import { useTransactionStore } from "./transaction";
import { useMetaStore } from "./meta";
import createSelectors from "./selectors";
import { SelectableWallet, Wallet } from "../types";

export type TokenBalance = {
  chain: string;
  symbol: string;
  ticker: string;
  address: string | null;
  rawAmount: string;
  decimal: number | null;
  amount: string;
  logo: string | null;
  usdPrice: number | null;
};

export interface ConnectedWallet extends Wallet {
  balances: TokenBalance[] | null;
  loading: boolean;
  error: boolean;
  explorerUrl: string | null;
}

interface WalletsStore {
  connectedWallets: ConnectedWallet[];
  selectedWallets: Wallet[];
  customDestination: string;
  connectWallet: (accounts: Wallet[]) => void;
  disconnectWallet: (walletType: WalletType) => void;
  initSelectedWallets: () => void;
  setSelectedWallet: (wallet: SelectableWallet) => void;
  clearConnectedWallet: () => void;
  getWalletsDetails: (accounts: Wallet[], shouldRetry?: boolean) => void;
  setCustomDestination: (customDestination: string) => void;
}

export const useWalletsStore = createSelectors(
  create<WalletsStore>()(
    subscribeWithSelector((set, get) => ({
      connectedWallets: [],
      selectedWallets: [],
      customDestination: "",
      connectWallet: (accounts) => {
        const getWalletsDetails = get().getWalletsDetails;
        set((state) => ({
          connectedWallets: state.connectedWallets
            .filter((wallet) => wallet.walletType !== accounts[0].walletType)
            .concat(
              accounts.map((account) => ({
                balances: [],
                address: account.address,
                chain: account.chain,
                loading: true,
                walletType: account.walletType,
                error: false,
                explorerUrl: null,
              }))
            ),
        }));
        getWalletsDetails(accounts);
      },
      disconnectWallet: (walletType) => {
        set((state) => ({
          connectedWallets: state.connectedWallets.filter(
            (balance) => balance.walletType !== walletType
          ),
          selectedWallets: state.selectedWallets.filter(
            (wallet) => wallet.walletType != walletType
          ),
        }));
      },
      initSelectedWallets: () =>
        set((state) => {
          const requiredChains = getRequiredChains(
            useTransactionStore.getState().bestRoute
          );
          const connectedWallets = state.connectedWallets;
          const selectedWallets: Wallet[] = [];
          requiredChains.forEach((chain) => {
            const anyWalletSelected = !!state.selectedWallets.find(
              (wallet) => wallet.chain === chain
            );

            if (!anyWalletSelected) {
              const firstWalletWithMatchedChain = connectedWallets.find(
                (wallet) => wallet.chain === chain
              );
              if (!!firstWalletWithMatchedChain)
                selectedWallets.push({
                  address: firstWalletWithMatchedChain.address,
                  chain: firstWalletWithMatchedChain.chain,
                  walletType: firstWalletWithMatchedChain.walletType,
                });
            }
          });
          return {
            selectedWallets: state.selectedWallets.concat(selectedWallets),
          };
        }),
      setSelectedWallet: (wallet) =>
        set((state) => ({
          selectedWallets: state.selectedWallets
            .filter((selectedWallet) => selectedWallet.chain !== wallet.chain)
            .concat({
              chain: wallet.chain,
              address: wallet.address,
              walletType: wallet.walletType,
            }),
        })),
      setCustomDestination: (customDestination) =>
        set(() => ({
          customDestination,
        })),
      clearConnectedWallet: () =>
        set(() => ({
          connectedWallets: [],
          selectedWallets: [],
        })),
      getWalletsDetails: async (accounts, shouldRetry = true) => {
        // const getWalletsDetails = get().getWalletsDetails;
        // const { tokens } = useMetaStore.getState().meta;
        set((state) => ({
          connectedWallets: state.connectedWallets.map((wallet) => {
            return accounts.find((account) =>
              isAccountAndWalletMatched(account, wallet)
            )
              ? { ...wallet, loading: true }
              : wallet;
          }),
        }));
      },
    }))
  )
);

useWalletsStore.subscribe(
  (state) => state.connectedWallets,
  (connectedWallets) => {
    useTransactionStore.setState(({ sourceTokens, destinationTokens }) => {
      const sourceTokensWithBalance = getTokensWithBalance(
        sourceTokens,
        connectedWallets
      );
      const destinationTokensWithBalance = getTokensWithBalance(
        destinationTokens,
        connectedWallets
      );
      return {
        sourceTokens: sortTokens(sourceTokensWithBalance),
        destinationTokens: sortTokens(destinationTokensWithBalance),
      };
    });
  },
  {
    equalityFn: shallow,
  }
);

export const fetchingBalanceSelector = (state: WalletsStore) =>
  !!state.connectedWallets.find((wallet) => wallet.loading);
