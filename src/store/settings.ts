import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import createSelectors from "./selectors";

type Theme = "auto" | "dark" | "light";

export interface SettingsState {
  infiniteApprove: boolean;
  theme: Theme;
  affiliateRef: string | null;
  affiliatePercent: number | null;
  affiliateWallets: { [key: string]: string } | null;
  toggleInfiniteApprove: () => void;
  setTheme: (theme: Theme) => void;
  setAffiliateRef: (affiliateRef: string | null) => void;
  setAffiliatePercent: (affiliatePercent: number | null) => void;
  setAffiliateWallets: (
    affiliateWallets: { [key: string]: string } | null
  ) => void;
}

export const useSettingsStore = createSelectors(
  create<SettingsState>()(
    persist(
      subscribeWithSelector((set) => ({
        infiniteApprove: false,
        affiliateRef: null,
        affiliatePercent: null,
        affiliateWallets: null,
        theme: "auto",
        setAffiliateRef: (affiliateRef) =>
          set(() => ({
            affiliateRef,
          })),
        setAffiliatePercent: (affiliatePercent) =>
          set(() => ({
            affiliatePercent,
          })),
        setAffiliateWallets: (affiliateWallets) =>
          set(() => ({
            affiliateWallets,
          })),
        toggleInfiniteApprove: () =>
          set((state) => ({
            infiniteApprove: !state.infiniteApprove,
          })),
        setTheme: (theme) =>
          set(() => ({
            theme,
          })),
      })),
      {
        name: "user-settings",
        skipHydration: true,
      }
    )
  )
);
