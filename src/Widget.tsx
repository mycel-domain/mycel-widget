import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppRouter } from "./components/AppRouter";
import { WalletType } from "./wallets/shared";
import { Layout } from "./components/Layout";
import { globalFont } from "./globalStyles";
import { useTheme } from "./hooks/useTheme";
import { WidgetConfig } from "./types";
import { useUiStore } from "./store/ui";
import { navigationRoutes } from "./constants/navigationRoutes";
import { initConfig } from "./utils/configs";
import { WidgetContext, WidgetWallets } from "./Wallets";
import { WidgetEvents } from "./components/WidgetEvents";
import { useSettingsStore } from "./store/settings";
import { styled } from "./theme";
import { SwapContainer } from "./UI";

const MainContainer = styled("div", {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export type WidgetProps = {
  config?: WidgetConfig;
};

export function Main(props: PropsWithChildren<WidgetProps>) {
  const { config } = props;
  globalFont(config?.theme?.fontFamily || "Roboto");

  const { activeTheme } = useTheme(config?.theme || {});
  const [
    lastConnectedWalletWithNetwork,
    setLastConnectedWalletWithNetwork,
  ] = useState<string>("");
  const [disconnectedWallet, setDisconnectedWallet] = useState<WalletType>();
  const currentPage = useUiStore.use.currentPage();
  const widgetContext = useContext(WidgetContext);

  useEffect(() => {
    useSettingsStore.persist.rehydrate();
    widgetContext.onConnectWallet(setLastConnectedWalletWithNetwork);
  }, []);

  return (
    <MainContainer id="swap-container" className={activeTheme}>
      <WidgetEvents />
      <SwapContainer fixedHeight={currentPage !== navigationRoutes.home}>
        <AppRouter
          lastConnectedWallet={lastConnectedWalletWithNetwork}
          disconnectedWallet={disconnectedWallet}
          clearDisconnectedWallet={() => {
            setDisconnectedWallet(undefined);
          }}
        >
          <Layout config={config} />
        </AppRouter>
      </SwapContainer>
    </MainContainer>
  );
}

export function Widget(props: PropsWithChildren<WidgetProps>) {
  if (!props.config?.externalWallets) {
    return (
      <WidgetWallets
        providers={props.config?.wallets}
        options={{
          walletConnectProjectId: props.config?.walletConnectProjectId,
        }}
      >
        <Main {...props} />
      </WidgetWallets>
    );
  }
  return <Main {...props} />;
}
