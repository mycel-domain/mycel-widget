import {
  WidgetTheme,
  WidgetConfig,
  WidgetColors,
  BlockchainAndTokenConfig,
} from "./types";
import { WidgetProps, Widget } from "./Widget";
import { WidgetWallets } from "./Wallets";
import { WalletType } from "./wallets/shared";
import { ProviderInterface, EventHandler as HandleWalletsUpdate, useWallets } from "./wallets/react";

export type {
  WidgetConfig,
  WalletType,
  WidgetTheme,
  WidgetColors,
  ProviderInterface,
  BlockchainAndTokenConfig,
  WidgetProps,
  HandleWalletsUpdate,
};
export {
  Widget,
  WidgetWallets,
  useWallets,
};

export * from "./UI";
export * from "./containers";
export * from "./theme";
export * from "./hooks";
export { generateRangeColors } from "./hooks";
