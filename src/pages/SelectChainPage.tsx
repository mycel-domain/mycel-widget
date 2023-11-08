import React from "react";
import { useTransactionStore } from "../store/transaction";
import { useMetaStore } from "../store/meta";
import { useNavigateBack } from "../hooks/useNavigateBack";
import { navigationRoutes } from "../constants/navigationRoutes";
import { BlockchainSelector } from "../containers";
import { RegistryNetworkName } from "mycel-client-ts/mycel.resolver/rest";

interface PropTypes {
  supportedChains?: string[];
}

export function SelectChainPage(props: PropTypes) {
  const { supportedChains } = props;
  const blockchains = supportedChains
    ? useMetaStore.use
      .meta()
      .blockchains.filter((chain) => supportedChains.includes(chain.name))
    : useMetaStore.use.meta().blockchains;
  const loadingStatus = useMetaStore.use.loadingStatus();
  const fromChain = useTransactionStore.use.fromChain();
  const setFromChain = useTransactionStore.use.setFromChain();
  const setTargetNetworkName = useTransactionStore.use.setTargetNetworkName();

  const { navigateBackFrom } = useNavigateBack();

  return (
    <BlockchainSelector
      list={blockchains}
      selected={fromChain}
      loadingStatus={loadingStatus}
      onChange={(chain) => {
        setFromChain(chain, true);
        setTargetNetworkName(chain.name as RegistryNetworkName);
        navigateBackFrom(navigationRoutes.fromChain);
      }}
      onBack={navigateBackFrom.bind(null, navigationRoutes.fromChain)}
    />
  );
}
