import {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  getAptosAccounts,
  getSuiAccounts,
  ProviderConnectResult,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from "../shared";
import BitgetLogo from "../../assets/wallets/bitget.svg";
import {
  aptosBlockchain,
  BlockchainMeta,
  isAptosBlockchain,
  isSolanaBlockchain,
  isSuiBlockchain,
  SignerFactory,
  suiBlockchain,
} from "../../types";

import {
  canEagerlyConnectToEvm,
  canSwitchNetworkToEvm,
  chooseInstance,
  getEvmAccounts,
  getSolanaAccounts,
  Networks,
  switchNetworkForEvm,
  WalletTypes,
} from "../shared";
import { evmBlockchains, isEvmBlockchain, solanaBlockchain } from "../../types";

import { bitgetInstances } from "./helpers";
import signer from "./signer";

const WALLET = WalletTypes.BITGET;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.ETHEREUM,
};

export const getInstance = bitgetInstances;

export const connect: Connect = async ({ instance, meta }) => {
  const ethInstance = chooseInstance(instance, meta, Networks.ETHEREUM);
  // TODO: commented out when adding solana aptos sui chains
  // const solanaInstance = chooseInstance(instance, meta, Networks.SOLANA);
  // const aptosInstance = chooseInstance(instance, meta, Networks.APTOS);
  // const suiInstance = chooseInstance(instance, meta, Networks.SUI);

  const results: ProviderConnectResult[] = [];

  if (ethInstance) {
    const evmResult = await getEvmAccounts(ethInstance);
    results.push(evmResult);
  }

  // if (solanaInstance) {
  //   const solanaAccounts = await getSolanaAccounts({
  //     instance: solanaInstance,
  //     meta,
  //   });
  //   results.push(solanaAccounts as ProviderConnectResult);
  //   console.log("solanaAccounts", solanaAccounts);
  // }

  // if (aptosInstance) {
  //   const aptosAccounts = await getAptosAccounts({
  //     instance: aptosInstance,
  //     meta: [],
  //   });
  //   results.push(aptosAccounts as ProviderConnectResult);
  // }

  // if (suiInstance) {
  //   const suiAccounts = await getSuiAccounts({
  //     instance: suiInstance,
  //     meta: [],
  //   });
  //   results.push(suiAccounts as ProviderConnectResult);
  // }

  return results;
};

export const subscribe: Subscribe = (options) => {
  const {
    connect,
    updateAccounts,
    state,
    updateChainId,
    meta,
    instance,
  } = options;

  const ethInstance = chooseInstance(instance, meta, Networks.ETHEREUM);
  // const solanaInstance = chooseInstance(instance, meta, Networks.SOLANA);
  // const aptosInstance = chooseInstance(instance, meta, Networks.APTOS);
  // const suiInstance = chooseInstance(instance, meta, Networks.SUI);

  if (ethInstance) {
    ethInstance?.on("accountsChanged", (addresses: string[]) => {
      const eth_chainId = meta
        .filter(isEvmBlockchain)
        .find((blockchain) => blockchain.name === Networks.ETHEREUM)?.chainId;
      if (state.connected) {
        if (state.network != Networks.ETHEREUM && eth_chainId) {
          updateChainId(eth_chainId);
        }
        updateAccounts(addresses);
      }
    });
  }

  // if (solanaInstance) {
  //   solanaInstance?.on("accountChanged", async (publicKey: string) => {
  //     if (state.network != Networks.SOLANA) {
  //       updateChainId(meta.filter(isSolanaBlockchain)[0].chainId);
  //     }
  //     const network = Networks.SOLANA;
  //     if (publicKey) {
  //       const account = publicKey.toString();
  //       updateAccounts([account]);
  //     } else {
  //       connect(network);
  //     }
  //   });
  // }

  // if (aptosInstance) {
  //   aptosInstance?.on("accountChanged", async (publicKey: string) => {
  //     if (state.network != Networks.APTOS) {
  //       updateChainId(meta.filter(isAptosBlockchain)[0].chainId);
  //     }
  //     const network = Networks.APTOS;
  //     console.log("aptosins", network);
  //     if (publicKey) {
  //       const account = publicKey.toString();
  //       updateAccounts([account]);
  //     } else {
  //       connect(network);
  //     }
  //   });
  // }

  // if (suiInstance) {
  //   suiInstance?.on("accountChanged", async (publicKey: string) => {
  //     if (state.network != Networks.SUI) {
  //       updateChainId(meta.filter(isSuiBlockchain)[0].chainId);
  //     }
  //     const network = Networks.SUI;
  //     if (publicKey) {
  //       const account = publicKey.toString();
  //       updateAccounts([account]);
  //     } else {
  //       connect(network);
  //     }
  //   });
  // }
};

export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const canEagerConnect: CanEagerConnect = async ({ instance, meta }) => {
  const evm_instance = chooseInstance(instance, meta, Networks.ETHEREUM);
  const solana_instance = chooseInstance(instance, meta, Networks.SOLANA);
  if (evm_instance) {
    return canEagerlyConnectToEvm({ instance: evm_instance, meta });
  }

  if (solana_instance) {
    try {
      const result = await instance.connect({ onlyIfTrusted: true });
      return !!result;
    } catch (error) {
      return false;
    }
  }

  return Promise.resolve(false);
};
export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  // const solana = solanaBlockchain(allBlockChains);
  // const aptos = aptosBlockchain(allBlockChains);
  // const sui = suiBlockchain(allBlockChains);
  return {
    name: "Bitget",
    img: BitgetLogo,
    installLink: {
      CHROME:
        "https://chrome.google.com/webstore/detail/bitkeep-crypto-nft-wallet/jiidiaalihmmhddjgbnbgdfflelocpak",
      BRAVE:
        "https://chrome.google.com/webstore/detail/bitkeep-crypto-nft-wallet/jiidiaalihmmhddjgbnbgdfflelocpak",
      DEFAULT: "https://web3.bitget.com/en/wallet-download?type=1",
    },
    color: "#ffffff",
    supportedChains: [...evms],
  };
};
