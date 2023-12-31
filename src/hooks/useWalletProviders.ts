import { useEffect } from "react";
import { useWalletsStore } from "../store/wallets";
import { WidgetConfig } from "../types";
import {
  matchAndGenerateProviders,
  ProvidersOptions,
} from "../utils/providers";
import { ProviderInterface } from "../wallets/react";

export function useWalletProviders(
  providers: WidgetConfig["wallets"],
  options?: ProvidersOptions
) {
  const clearConnectedWallet = useWalletsStore.use.clearConnectedWallet();
  let generateProviders: ProviderInterface[] = matchAndGenerateProviders(
    undefined,
    options
  );

  useEffect(() => {
    clearConnectedWallet();
    generateProviders = matchAndGenerateProviders(providers, {
      walletConnectProjectId: options?.walletConnectProjectId,
    });
  }, [providers]);

  return {
    providers: generateProviders,
  };
}
