import React from "react";
import { useTransactionStore } from "../store/transaction";
import { useNavigateBack } from "../hooks/useNavigateBack";
import { navigationRoutes } from "../constants/navigationRoutes";
import {
  getSortedTokenList,
  removeDublicatedTokens,
  tokensAreEqual,
} from "../utils/wallets";
import { useMetaStore } from "../store/meta";
import { TokenSelector } from "../containers";
import { Asset } from "../types";
import { Token } from "../types/api/main";
import { useTokens } from "../hooks/useTokens";

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
  const { supportedTokens } = props;
  const { navigateBackFrom } = useNavigateBack();
  const { tokenList } = useTokens();
  const fromTokens = useTransactionStore.use.fromTokens();
  const fromChain = useTransactionStore.use.fromChain();
  const fromToken = useTransactionStore.use.fromToken();
  const setFromToken = useTransactionStore.use.setFromToken();
  const loadingMetaStatus = useMetaStore.use.loadingStatus();

  const externalTokenList = getSortedTokenList(fromChain, tokenList);
  const supportedSourceTokens = supportedTokens
    ? fromTokens.filter((token) =>
        supportedTokens.some((supportedToken) =>
          tokensAreEqual(supportedToken, token)
        )
      )
    : fromTokens;
  const filteredTokenList =
    supportedSourceTokens[0] && supportedSourceTokens[0].address
      ? removeDublicatedTokens(supportedSourceTokens[0], externalTokenList)
      : externalTokenList;

  return (
    <TokenSelector
      list={filteredTokenList.concat(supportedSourceTokens)}
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
