import * as bitget from "../provider-bitget";
// import * as keplr from "../provider-keplr";
import * as metamask from "../provider-metamask";

type Enviroments = Record<string, Record<string, string>>;

export const allProviders = (enviroments?: Enviroments) => {
  // walletconnect2.init(enviroments?.walletconnect2 || {});

  return [
    metamask,
    // walletconnect2,
    // keplr,
    bitget,
  ];
};
