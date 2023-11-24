import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWallets } from "../wallets/react";
import { navigationRoutes } from "../constants/navigationRoutes";
import { useUiStore } from "../store/ui";
import { AppRoutes } from "./AppRoutes";
import { fetchingBalanceSelector, useWalletsStore } from "../store/wallets";
import {
  calculateWalletUsdValue,
  getSelectableWallets,
  tokensAreEqual,
} from "../utils/wallets";
import { removeDuplicateFrom } from "../utils/common";
import { WidgetConfig } from "../types";
import { useMetaStore } from "../store/meta";
import { useSettingsStore } from "../store/settings";
import { HeaderLayout } from "../UI";
import { useTransactionStore } from "../store/transaction";

export type LayoutProps = {
  config?: WidgetConfig;
};

export function Layout({ config }: LayoutProps) {
  const navigate = useNavigate();
  const { connectedWallets, selectedWallets } = useWalletsStore();
  const { getWalletInfo } = useWallets();
  const connectedWalletsImages = removeDuplicateFrom(
    getSelectableWallets(connectedWallets, selectedWallets, getWalletInfo).map(
      (w) => w.image
    )
  );
  const { blockchains, tokens } = useMetaStore.use.meta();
  const setFromChain = useTransactionStore.use.setFromChain();
  const setFromToken = useTransactionStore.use.setFromToken();
  const setAffiliateRef = useSettingsStore.use.setAffiliateRef();
  const setAffiliatePercent = useSettingsStore.use.setAffiliatePercent();
  const setAffiliateWallets = useSettingsStore.use.setAffiliateWallets();
  const totalBalance = calculateWalletUsdValue(connectedWallets);
  const connectWalletsButtonDisabled = useUiStore.use.connectWalletsButtonDisabled();
  const loadingMetaStatus = useMetaStore.use.loadingStatus();
  const fetchingBalance = useWalletsStore(fetchingBalanceSelector);

  useEffect(() => {
    if (loadingMetaStatus === "success") {
      const chain = blockchains.find(
        (chain) => chain.name === config?.from?.blockchain
      );
      const token = tokens.find((t) =>
        tokensAreEqual(t, config?.from?.token || null)
      );

      setFromChain(chain || null);
      setFromToken(token || null);
    }
  }, [config?.from?.token, config?.from?.blockchain, loadingMetaStatus]);

  useEffect(() => {
    setAffiliateRef(config?.affiliate?.ref ?? null);
    setAffiliatePercent(config?.affiliate?.percent ?? null);
    setAffiliateWallets(config?.affiliate?.wallets ?? null);
  }, [
    config?.affiliate?.ref,
    config?.affiliate?.percent,
    config?.affiliate?.wallets,
  ]);

  return (
    <>
      <HeaderLayout
        loadingStatus={loadingMetaStatus}
        connectedWalletsImages={connectedWalletsImages}
        connectedWallets={connectedWallets}
        totalBalance={totalBalance}
        fetchingBalance={fetchingBalance}
        onClick={() => {
          if (!connectWalletsButtonDisabled) navigate(navigationRoutes.wallets);
        }}
      >
        <AppRoutes config={config} />
      </HeaderLayout>
    </>
  );
}
