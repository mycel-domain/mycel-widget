import React from "react";
import { useTransactionStore } from "../store/transaction";
import { useMetaStore } from "../store/meta";
import { useNavigateBack } from "../hooks/useNavigateBack";
import { navigationRoutes } from "../constants/navigationRoutes";
import { BlockchainSelector } from "../containers";
import { changeTargetName } from "../utils/common";
import { RegistryNetworkName } from "mycel-client-ts/mycel.registry/rest";

interface PropTypes {
  type: "from" | "to";
  supportedChains?: string[];
}

export function SelectChainPage(props: PropTypes) {
  const { type, supportedChains } = props;
  const blockchains = supportedChains
    ? useMetaStore.use
      .meta()
      .blockchains.filter((chain) => supportedChains.includes(chain.name))
    : useMetaStore.use.meta().blockchains;
  const loadingStatus = useMetaStore.use.loadingStatus();
  const fromChain = useTransactionStore.use.fromChain();
  const toChain = useTransactionStore.use.toChain();
  const setFromChain = useTransactionStore.use.setFromChain();
  const setTargetNetworkName = useTransactionStore.use.setTargetNetworkName();
  const setToChain = useTransactionStore.use.setToChain();

  const { navigateBackFrom } = useNavigateBack();

  return (
    <BlockchainSelector
      type={type === "from" ? "Source" : "Destination"}
      list={blockchains}
      selected={type === "from" ? fromChain : toChain}
      loadingStatus={loadingStatus}
      onChange={(chain) => {
        if (type === "from") {
          setFromChain(chain, true);
          setTargetNetworkName(chain.name as RegistryNetworkName);
        } else setToChain(chain, true);
        navigateBackFrom(navigationRoutes.fromChain);
      }}
      onBack={navigateBackFrom.bind(null, navigationRoutes.fromChain)}
    />
  );
}
