import React from "react";
import { useTransactionStore } from "../store/transaction";
import { useNavigateBack } from "../hooks/useNavigateBack";
import { navigationRoutes } from "../constants/navigationRoutes";
import { tokensAreEqual } from "../utils/wallets";
import { useMetaStore } from "../store/meta";
import { TokenSelector } from "../containers";
import { Asset } from "../types";
import { Token } from "../types/api/main";

interface PropTypes {
  type: "from" | "to";
  supportedTokens?: Asset[];
}

export interface TokenWithBalance extends Token {
  balance?: {
    amount: string;
    usdValue: string;
  };
}

export function SelectTokenPage(props: PropTypes) {
  const { navigateBackFrom } = useNavigateBack();

  const { type, supportedTokens } = props;
  const sourceTokens = useTransactionStore.use.sourceTokens();
  const destinationTokens = useTransactionStore.use.destinationTokens();
  const supportedSourceTokens = supportedTokens
    ? sourceTokens.filter((token) =>
        supportedTokens.some((supportedToken) =>
          tokensAreEqual(supportedToken, token)
        )
      )
    : sourceTokens;

  const supportedDestinationTokens = supportedTokens
    ? destinationTokens.filter((token) =>
        supportedTokens.some((supportedToken) =>
          tokensAreEqual(supportedToken, token)
        )
      )
    : destinationTokens;

  const fromToken = useTransactionStore.use.fromToken();
  const toToken = useTransactionStore.use.toToken();
  const setFromToken = useTransactionStore.use.setFromToken();
  const setToToken = useTransactionStore.use.setToToken();
  const loadingMetaStatus = useMetaStore.use.loadingStatus();

  return (
    <TokenSelector
      type={type === "from" ? "Source" : "Destination"}
      list={type == "from" ? supportedSourceTokens : supportedDestinationTokens}
      selected={type === "from" ? fromToken : toToken}
      onChange={(token) => {
        if (type === "from") setFromToken(token);
        else setToToken(token);
        navigateBackFrom(navigationRoutes.fromToken);
      }}
      onBack={navigateBackFrom.bind(null, navigationRoutes.fromToken)}
      loadingStatus={loadingMetaStatus}
    />
  );
}
