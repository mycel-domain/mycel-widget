import React from "react";
import { useRoutes } from "react-router-dom";
import { navigationRoutes } from "../constants/navigationRoutes";
import { Home } from "../pages/Home";
import { SelectChainPage } from "../pages/SelectChainPage";
import { SelectTokenPage } from "../pages/SelectTokenPage";
import { WalletsPage } from "../pages/WalletsPage";
import { WidgetConfig } from "../types";

interface PropTypes {
  config?: WidgetConfig;
}

export function AppRoutes(props: PropTypes) {
  const { config } = props;

  return useRoutes([
    {
      path: navigationRoutes.home,
      element: <Home />,
    },
    {
      path: navigationRoutes.fromChain,
      element: <SelectChainPage supportedChains={config?.from?.blockchains} />,
    },
    {
      path: navigationRoutes.fromToken,
      element: (
        <SelectTokenPage type="from" supportedTokens={config?.from?.tokens} />
      ),
    },
    {
      path: navigationRoutes.wallets,
      element: (
        <WalletsPage
          supportedWallets={config?.wallets}
          multiWallets={
            typeof config?.multiWallets === "undefined"
              ? true
              : config.multiWallets
          }
          config={config}
        />
      ),
    },
  ]);
}
