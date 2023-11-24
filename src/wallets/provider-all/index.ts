import * as bitget from "../provider-bitget";
import * as metamask from "../provider-metamask";
import * as okx from "../provider-okx";
import * as phantom from "../provider-phantom";
import * as petra from "../provider-petra";
// import * as sui from "../provider-sui";

export const allProviders = () => {
  return [metamask, petra, okx, phantom, bitget];
};
