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

  const { supportedTokens } = props;
  const fromTokens = useTransactionStore.use.fromTokens();
  const supportedSourceTokens = supportedTokens
    ? fromTokens.filter((token) =>
      supportedTokens.some((supportedToken) =>
        tokensAreEqual(supportedToken, token)
      )
    )
    : fromTokens;

  const fromToken = useTransactionStore.use.fromToken();
  const setFromToken = useTransactionStore.use.setFromToken();
  const loadingMetaStatus = useMetaStore.use.loadingStatus();

  return (
    <TokenSelector
      list={supportedSourceTokens}
      selected={fromToken}
      onChange={(token) => {
        setFromToken(token);
        navigateBackFrom(navigationRoutes.fromToken);
      }}
      onBack={navigateBackFrom.bind(null, navigationRoutes.fromToken)}
      loadingStatus={loadingMetaStatus}
    />
  );
}
