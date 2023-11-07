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
import PetraLogo from "../../assets/wallets/petra.svg";
import {
  aptosBlockchain,
  BlockchainMeta,
  isAptosBlockchain,
  SignerFactory,
} from "../../types";

import {
  canEagerlyConnectToEvm,
  canSwitchNetworkToEvm,
  chooseInstance,
  Networks,
  switchNetworkForEvm,
  WalletTypes,
} from "../shared";

import { petraInstances } from "./helpers";
import signer from "./signer";

const WALLET = WalletTypes.PETRA;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.APTOS,
};

export const getInstance = petraInstances;

export const connect: Connect = async ({ instance }) => {
  console.log("instance", instance);

  const results: ProviderConnectResult[] = [];

  if (instance) {
    const aptosAccounts = await getAptosAccounts({
      instance,
      meta: [],
    });
    results.push(aptosAccounts as ProviderConnectResult);
  }

  return results;
};

export const subscribe: Subscribe = (options) => {
  const { connect, updateAccounts, state, updateChainId, meta, instance } =
    options;

  instance?.on("accountChanged", async (publicKey: string) => {
    if (state.network != Networks.APTOS) {
      updateChainId(meta.filter(isAptosBlockchain)[0].chainId);
    }
    const network = Networks.APTOS;
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
  const aptos = aptosBlockchain(allBlockChains);
  return {
    name: "Petra",
    img: PetraLogo,
    installLink: {
      CHROME:
        "https://chrome.google.com/webstore/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci",
      BRAVE:
        "https://chrome.google.com/webstore/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci",
      DEFAULT: "https://petra.app/",
    },
    color: "#ffffff",
    supportedChains: [...aptos],
  };
};
