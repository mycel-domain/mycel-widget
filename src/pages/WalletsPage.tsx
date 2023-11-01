import React, { useEffect, useRef, useState } from "react";
import { getlistWallet, sortWalletsBasedOnState } from "../utils/wallets";
import { useUiStore } from "../store/ui";
import { useNavigateBack } from "../hooks/useNavigateBack";
import { navigationRoutes } from "../constants/navigationRoutes";
import { useMetaStore } from "../store/meta";
import { WalletInfo, WalletState, WidgetConfig } from "../types";
import { configWalletsToWalletName } from "../utils/providers";
import { styled } from "../theme";
import SuiLogo from "../assets/wallets/sui.svg";
import {
  Alert,
  LoadingFailedAlert,
  SecondaryPage,
  Spinner,
  Wallet,
} from "../UI";
import {
  detectMobileScreens,
  WalletType,
  WalletTypes,
} from "../wallets/shared";
import { useWallets } from "../wallets/react";

interface PropTypes {
  supportedWallets: WidgetConfig["wallets"];
  multiWallets: boolean;
  config?: WidgetConfig;
}

const ListContainer = styled("div", {
  display: "grid",
  gap: ".5rem",
  gridTemplateColumns: " repeat(2, minmax(0, 1fr))",
  alignContent: "baseline",
  padding: "0.5rem",
  overflowY: "auto",
});

const LoaderContainer = styled("div", {
  display: "flex",
  justifyContent: "center",
  width: "100%",
  position: "absolute",
  top: "50%",
});

const AlertContainer = styled("div", {
  paddingBottom: "$16",
});

const ALL_SUPPORTED_WALLETS = Object.values(WalletTypes);

export function WalletsPage({
  supportedWallets,
  multiWallets,
  config,
}: PropTypes) {
  console.log("suppotr", supportedWallets);
  const { navigateBackFrom } = useNavigateBack();
  const { state, disconnect, getWalletInfo, connect } = useWallets();
  const wallets = getlistWallet(
    state,
    getWalletInfo,
    configWalletsToWalletName(supportedWallets, {
      walletConnectProjectId: config?.walletConnectProjectId,
    }) || ALL_SUPPORTED_WALLETS
  );
  const walletsRef = useRef<WalletInfo[]>();

  let sortedWallets = detectMobileScreens()
    ? wallets.filter((wallet) => wallet.showOnMobile)
    : wallets;
  sortedWallets = sortWalletsBasedOnState(sortedWallets);
  const [walletErrorMessage, setWalletErrorMessage] = useState("");
  const toggleConnectWalletsButton = useUiStore.use.toggleConnectWalletsButton();
  const loadingMetaStatus = useMetaStore.use.loadingStatus();
  console.log("sorteed", sortedWallets);

  const onSelectWallet = async (type: WalletType) => {
    const wallet = state(type);
    try {
      if (walletErrorMessage) setWalletErrorMessage("");
      if (wallet.connected) {
        await disconnect(type);
      } else {
        if (
          !multiWallets &&
          !!wallets.find((w) => w.state === WalletState.CONNECTED)
        ) {
          return;
        }
        await connect(type);
      }
    } catch (e) {
      setWalletErrorMessage("Error: " + (e as any)?.message);
    }
  };
  const disconnectConnectingWallets = () => {
    const connectingWallets =
      walletsRef.current?.filter(
        (wallet) => wallet.state === WalletState.CONNECTING
      ) || [];
    for (const wallet of connectingWallets) {
      disconnect(wallet.type);
    }
  };
  useEffect(() => {
    toggleConnectWalletsButton();
    return () => {
      disconnectConnectingWallets();
      toggleConnectWalletsButton();
    };
  }, []);

  useEffect(() => {
    walletsRef.current = wallets;
  }, [wallets]);

  return (
    <SecondaryPage
      title={"Select Wallet" || ""}
      textField={false}
      onBack={navigateBackFrom.bind(null, navigationRoutes.wallets)}
    >
      <>
        {walletErrorMessage && (
          <AlertContainer>
            <Alert type="error" title={walletErrorMessage} />
          </AlertContainer>
        )}
        {loadingMetaStatus === "loading" && (
          <LoaderContainer className="loader">
            <Spinner size={24} />
          </LoaderContainer>
        )}
        {loadingMetaStatus === "failed" && <LoadingFailedAlert />}
        <ListContainer>
          {loadingMetaStatus === "success" &&
            sortedWallets.map((wallet, index) => (
              <Wallet
                {...wallet}
                key={`${index}-${wallet.type}`}
                onClick={onSelectWallet}
              />
            ))}
          <Wallet
            key={"4-suiwallet"}
            onClick={onSelectWallet}
            state={WalletState.DISCONNECTED}
            installLink={
              "https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil"
            }
            name={"Sui Wallet"}
            image={SuiLogo}
            type={"suiwallet"}
            showOnMobile={false}
          />
        </ListContainer>
      </>
    </SecondaryPage>
  );
}
