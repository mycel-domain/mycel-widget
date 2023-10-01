import { WalletType } from "../wallets/shared";

export * from "./wallet";

export interface Wallet {
  chain: string;
  address: string;
  walletType: WalletType;
}
