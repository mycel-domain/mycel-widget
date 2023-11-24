import { create } from "zustand";
import createSelectors from "./selectors";
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
