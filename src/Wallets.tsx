import React, { PropsWithChildren } from 'react';
import { useMetaStore } from './store/meta';
import { Events, Provider } from './wallets/react';
import type { EventHandler } from './wallets/react';
import { Network } from './wallets/shared';
import {
  prepareAccountsForWalletStore,
  walletAndSupportedChainsNames,
} from './utils/wallets';
import { useWalletsStore } from './store/wallets';
import { isAptosBlockchain, isEvmBlockchain, isSolanaBlockchain, isSuiBlockchain, WidgetConfig } from './types';
import { useWalletProviders } from './hooks/useWalletProviders';
import { createContext, useRef } from 'react';
import { ProvidersOptions } from './utils/providers';

type OnConnectHandler = (key: string) => void;
interface WidgetContextInterface {
  onConnectWallet(handler: OnConnectHandler): void;
}

export const WidgetContext = createContext<WidgetContextInterface>({
  onConnectWallet: () => {
    return;
  },
});

export function WidgetWallets(
  props: PropsWithChildren<{
    providers: WidgetConfig['wallets'];
    options?: ProvidersOptions;
    onUpdateState?: EventHandler;
  }>
) {
  const { blockchains } = useMetaStore.use.meta();
  const { providers } = useWalletProviders(props.providers, props?.options);
  const disconnectWallet = useWalletsStore.use.disconnectWallet();
  const connectWallet = useWalletsStore.use.connectWallet();
  const onConnectWalletHandler = useRef<OnConnectHandler>();

  const evmBasedChainNames = blockchains
    .filter(isEvmBlockchain)
    .map((chain) => chain.name);

  const solanaBasedChainNames = blockchains
    .filter(isSolanaBlockchain)
    .map((chain) => chain.name);

  const aptosBasedChainNames = blockchains
    .filter(isAptosBlockchain)
    .map((chain) => chain.name);

  const suiBasedChainNames = blockchains
    .filter(isSuiBlockchain)
    .map((chain) => chain.name);

  const onUpdateState: EventHandler = (
    type,
    event,
    value,
    state,
    supportedChains
  ) => {
    if (event === Events.ACCOUNTS) {
      if (value) {
        const supportedChainNames: Network[] | null =
          walletAndSupportedChainsNames(supportedChains);
        const data = prepareAccountsForWalletStore(
          type,
          value,
          evmBasedChainNames,
          solanaBasedChainNames,
          aptosBasedChainNames,
          suiBasedChainNames,
          supportedChainNames
        );
        connectWallet(data);
      } else {
        disconnectWallet(type);
      }
    }
    if (event === Events.ACCOUNTS && state.connected) {
      const key = `${type}-${state.network}-${value}`;

      if (state.connected) {
        if (!!onConnectWalletHandler.current)
          onConnectWalletHandler.current(key);
        else
          console.warn(
            `onConnectWallet handler hasn't been set. Are you sure?`
          );
      }
    }
    if (event === Events.NETWORK && state.network) {
      const key = `${type}-${state.network}`;
      if (!!onConnectWalletHandler.current) onConnectWalletHandler.current(key);
      else
        console.warn(`onConnectWallet handler hasn't been set. Are you sure?`);
    }

    // propagate updates for Dapps using external wallets
    if (props.onUpdateState) {
      props.onUpdateState(type, event, value, state, supportedChains);
    }
  };
  return (
    <WidgetContext.Provider
      value={{
        onConnectWallet: (handler) => {
          onConnectWalletHandler.current = handler;
        },
      }}>
      <Provider
        allBlockChains={blockchains}
        providers={providers}
        onUpdateState={onUpdateState}
        autoConnect>
        {props.children}
      </Provider>
    </WidgetContext.Provider>
  );
}
