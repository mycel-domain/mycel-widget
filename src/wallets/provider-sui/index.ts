import {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  getAptosAccounts,
  ProviderConnectResult,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from "../shared";
import SuiLogo from "../../assets/wallets/sui.svg";
import {
  BlockchainMeta,
  isAptosBlockchain,
  SignerFactory,
  suiBlockchain,
} from "../../types";

import {
  canEagerlyConnectToEvm,
  canSwitchNetworkToEvm,
  chooseInstance,
  Networks,
  switchNetworkForEvm,
  WalletTypes,
} from "../shared";

import { suiWalletInstances } from "./helpers";
import signer from "./signer";

const WALLET = WalletTypes.SUI;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.SUI,
};

export const getInstance = suiWalletInstances;

export const connect: Connect = async ({ instance }) => {
  console.log("instance", instance);

  const results: ProviderConnectResult[] = [];

  if (instance) {
    const suiAccounts = await getAptosAccounts({
      instance,
      meta: [],
    });
    results.push(suiAccounts as ProviderConnectResult);
  }

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

  instance?.on("accountChanged", async (publicKey: string) => {
    if (state.network != Networks.SUI) {
      updateChainId(meta.filter(isAptosBlockchain)[0].chainId);
    }
    const network = Networks.SUI;
    if (publicKey) {
      const account = publicKey.toString();
      updateAccounts([account]);
    } else {
      connect(network);
    }
  });
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
  const sui = suiBlockchain(allBlockChains);
  return {
    name: "Sui",
    img: SuiLogo,
    installLink: {
      CHROME:
        "https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil",
      BRAVE:
        "https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil",
      DEFAULT: "https://sui.io/",
    },
    color: "#ffffff",
    supportedChains: [...sui],
  };
};
