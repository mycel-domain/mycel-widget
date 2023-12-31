import { Button, AddWalletIcon, Typography, styled, Image } from "../..";
import React, { PropsWithChildren } from "react";
import { LoadingStatus } from "../../types/meta";
import { ConnectedWallet } from "../../types/wallet";

const Container = styled("div", {
  display: "flex",
  width: "100%",
  justifyContent: "end",
  ".balance": {
    display: "flex",
  },
});

const WalletImages = styled("div", {
  display: "flex",
  paddingLeft: "12px",
});

const WalletImageContainer = styled("div", {
  marginLeft: -15,
  marginRight: "$6",
  "& img": {
    borderRadius: "50%",
  },
});

interface HeaderLayoutProps {
  loadingStatus: LoadingStatus;
  connectedWalletsImages: string[];
  connectedWallets: ConnectedWallet[];
  totalBalance: string;
  fetchingBalance: boolean;
  onClick: () => void;
}
export function HeaderLayout({
  connectedWalletsImages,
  loadingStatus,
  connectedWallets,
  onClick,
  children,
}: PropsWithChildren<HeaderLayoutProps>) {
  return (
    <>
      <Container>
        <Button
          size="small"
          suffix={<AddWalletIcon size={20} />}
          variant="ghost"
          flexContent
          loading={loadingStatus === "loading"}
          disabled={loadingStatus === "failed"}
          onClick={onClick}
          prefix={
            connectedWalletsImages?.length ? (
              <WalletImages>
                {connectedWalletsImages.map((walletImage, index) => (
                  <WalletImageContainer key={index}>
                    <Image src={walletImage} size={24} />
                  </WalletImageContainer>
                ))}
              </WalletImages>
            ) : null
          }
        >
          <div className="balance">
            <Typography variant="body2">
              {!connectedWallets?.length && "Connect Wallet"
              // : `$${totalBalance || 0}`} // TODO: Add get balance
              }
            </Typography>
          </div>
        </Button>
      </Container>
      {children}
    </>
  );
}
