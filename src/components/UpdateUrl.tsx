import { useEffect, useRef } from "react";
import {
  createSearchParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useMetaStore } from "../store/meta";
import { SearchParams } from "../constants/searchParams";
import { navigationRoutes } from "../constants/navigationRoutes";
import { useUiStore } from "../store/ui";
import { searchParamsToToken } from "../utils/routing";

export function UpdateUrl() {
  const firstRender = useRef(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const firstRenderSearchParams = useRef(location.search);
  const searchParamsRef = useRef<Record<string, string>>({});
  // const fromChain = useTransactionStore.use.fromChain();
  // const toChain = useTransactionStore.use.toChain();
  // const fromToken = useTransactionStore.use.fromToken();
  // const toToken = useTransactionStore.use.toToken();
  // const setFromChain = useTransactionStore.use.setFromChain();
  // const setFromToken = useTransactionStore.use.setFromToken();
  // const setToChain = useTransactionStore.use.setToChain();
  // const setToToken = useTransactionStore.use.setToToken();
  // const inputAmount = useTransactionStore.use.inputAmount();
  // const setInputAmount = useTransactionStore.use.setInputAmount();
  const loadingStatus = useMetaStore.use.loadingStatus();
  const { blockchains, tokens } = useMetaStore.use.meta();
  const setSelectedSwap = useUiStore.use.setSelectedSwap();

  useEffect(() => {
    const params: Record<string, string> = {};
    createSearchParams(firstRenderSearchParams.current).forEach(
      (value, key) => {
        params[key] = value;
      }
    );
    searchParamsRef.current = params;
    const requestId =
      location.pathname.split(navigationRoutes.swaps + "/")[1] || null;
    if (requestId) setSelectedSwap(requestId);
  }, []);

  useEffect(() => {
    if (!firstRender.current) {
      let fromChainString = "",
        fromTokenString = "",
        toChainString = "",
        toTokenString = "",
        fromAmount = "";
      if (loadingStatus !== "success") {
        fromChainString = searchParamsRef.current[SearchParams.FROM_CHAIN];
        fromTokenString = searchParamsRef.current[SearchParams.FROM_TOKEN];
        toChainString = searchParamsRef.current[SearchParams.TO_CHAIN];
        toTokenString = searchParamsRef.current[SearchParams.TO_TOKEN];
        fromAmount = searchParamsRef.current[SearchParams.FROM_AMOUNT];
        // searchParamsRef.current[SearchParams.FROM_AMOUNT] || inputAmount;
      } else {
      }
      setSearchParams(
        {
          ...(fromChainString && {
            [SearchParams.FROM_CHAIN]: fromChainString,
          }),
          ...(fromTokenString && {
            [SearchParams.FROM_TOKEN]: fromTokenString,
          }),
          ...(toChainString && { [SearchParams.TO_CHAIN]: toChainString }),
          ...(toTokenString && { [SearchParams.TO_TOKEN]: toTokenString }),
          ...(fromAmount && {
            [SearchParams.FROM_AMOUNT]: fromAmount.toString(),
          }),
        },
        { replace: true }
      );
    }
    firstRender.current = false;
  }, [location.pathname]);
  // }, [location.pathname, inputAmount, fromChain, fromToken, toChain, toToken]);

  useEffect(() => {
    if (loadingStatus === "success") {
      const fromChainString = searchParams.get(SearchParams.FROM_CHAIN);
      const fromTokenString = searchParams.get(SearchParams.FROM_TOKEN);
      const toChainString = searchParams.get(SearchParams.TO_CHAIN);
      const toTokenString = searchParams.get(SearchParams.TO_TOKEN);
      const fromAmount = searchParams.get(SearchParams.FROM_AMOUNT);
      const fromChain = blockchains.find(
        (blockchain) => blockchain.name === fromChainString
      );
      const fromToken = searchParamsToToken(
        tokens,
        fromTokenString,
        fromChain || null
      );
      const toChain = blockchains.find(
        (blockchain) => blockchain.name === toChainString
      );
      const toToken = searchParamsToToken(
        tokens,
        toTokenString,
        toChain || null
      );
      if (!!fromChain) {
        // setFromChain(fromChain);
        // if (!!fromToken) setFromToken(fromToken);
      }
      if (!!toChain) {
        // setToChain(toChain);
        // if (!!toToken) setToToken(toToken);
      }
      // if (fromAmount) setInputAmount(fromAmount);
    }
  }, [loadingStatus]);

  return null;
}
