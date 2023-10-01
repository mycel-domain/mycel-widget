import React, { Fragment, PropsWithChildren } from "react";
import { MemoryRouter, useInRouterContext } from "react-router";
import { WalletType } from "../wallets/shared";
import { UpdateUrl } from "./UpdateUrl";

export function AppRouter({
  children,
  ...props
}: PropsWithChildren & {
  lastConnectedWallet: string;
  disconnectedWallet: WalletType | undefined;
  clearDisconnectedWallet: () => void;
}) {
  const isRouterInContext = useInRouterContext();
  const Router = isRouterInContext ? Fragment : MemoryRouter;
  return (
    <>
      <Router>{children}</Router>
      {isRouterInContext && <UpdateUrl />}
    </>
  );
}
