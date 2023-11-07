import { create } from "zustand";
import { httpService } from "../utils/httpService";
import createSelectors from "./selectors";
import { removeDuplicateFrom } from "../utils/common";
import AptosLogo from "../assets/chains/aptos.svg";
import SUILogo from "../assets/chains/sui.svg";
import { MetaResponse } from "../types/api/main";
import { chainList } from "../metaData/chain-list";
import { tokenList } from "../metaData/token-list";

export type LoadingStatus = "loading" | "success" | "failed";

export interface MetaState {
  meta: MetaResponse;
  loadingStatus: LoadingStatus;
  fetchMeta: () => Promise<void>;
}

export const useMetaStore = createSelectors(
  create<MetaState>()((set) => ({
    meta: {
      blockchains: [],
      popularTokens: [],
      swappers: [],
      tokens: [],
    },
    loadingStatus: "loading",
    fetchMeta: async () => {
      set({
        meta: {
          blockchains: chainList,
          tokens: tokenList,
          popularTokens: [],
          swappers: [],
        },
        loadingStatus: "success",
      });
    },
  }))
);
