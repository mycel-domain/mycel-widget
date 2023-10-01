import {
  EvmTransaction,
  Transaction,
  TransactionType,
} from "../types/api/main/";
import { WidgetConfig } from "../types";
import { allProviders } from "../wallets/provider-all";
import { ProviderInterface } from "../wallets/react/src";

export interface ProvidersOptions {
  walletConnectProjectId?: WidgetConfig["walletConnectProjectId"];
}

/**
 *
 * Generate a list of providers by passing a provider name (e.g. metamask) or a custom provider which implemented ProviderInterface.
 * @returns ProviderInterface[] a list of ProviderInterface
 *
 */
export function createTransaction(
  type: TransactionType
): Transaction | undefined {
  if (type === "EVM") {
    const transaction = {
      // The blockchain of the wallet
      blockChain: "Ethreum",

      // If true, this transaction wants the user to approve a smart contract
      // If a user signs an approval transaction, you should call checkApprove
      // endpoint to make sure the approval is saved on the blockchain, and then call
      // createTransaction again to get the main transaction
      isApprovalTx: false,

      // The signer wallet address
      from: "0x1F0D9dC71627184Af1E3672Edaac7ffEDC47BE10",

      // The smart contract or destination wallet address
      to: "0x1F0D9dC71627184Af1E3672Edaac7ffEDC47BE10",

      // The data that should be signed
      // It might be null in cases like transferring native token
      data: null,

      // The nullable amount field that should be passed to wallet
      value: null,

      // The gas limit field that should be passed to wallet
      gasLimit: "0x714b3",

      // The gas price field that should be passed to wallet
      gasPrice: null,

      // The nonce field that should be passed to wallet
      nonce: null,

      // Indicates that this object is a EVM transaction
      type: "EVM",
    };
    return transaction as Transaction;
  } else if (type === "SOLANA") {
    const transaction = {
      // Indicates that this object is a simple transfer transaction
      type: "TRANSFER",

      // The method of action, e.g. transfer or deposit
      method: "transfer",

      // User's wallet address
      fromWalletAddress: "0x1F0D9dC71627184Af1E3672Edaac7ffEDC47BE10",

      // The destination wallet address, example is a Thorchain inbound address
      recipientAddress: "0x1F0D9dC71627184Af1E3672Edaac7ffEDC47BE10",

      // The optional memo message that should be attached, this case Thorchain memo
      memo: "=:BNB.BNB:bnb1ukfhdgy9c0ws42eqt782039ept9ht6fag88t6u:726187",

      // The blockchain-readable amount of asset, example is 0.02 LTC
      amount: "0",

      // The decimals of the asset
      decimals: 9,

      asset: {
        // The blockchain of asset
        blockchain: "SOLANA",

        // The symbol of asset

        symbol: "SOL",
        // The contract address if asset

        address: null,

        // The ticker of asset, example: BUSD-BD1 in BNB
        ticker: "SOL",
      },
    };
    return transaction as Transaction;
  }
}

export function configWalletsToWalletName(
  config: WidgetConfig["wallets"],
  options?: ProvidersOptions
): string[] {
  const providers = matchAndGenerateProviders(config, options);
  const names = providers.map((provider) => {
    return provider.config.type;
  });
  return names;
}
