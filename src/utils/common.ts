import { RegistryNetworkName } from "mycel-client-ts/mycel.registry/rest";

export function removeDuplicateFrom<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function areEqual(
  array1: (number | string)[],
  array2: (number | string)[]
) {
  return (
    array1.length === array2.length && array1.every((v, i) => v === array2[i])
  );
}

export function debounce(fn: Function, time: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null;
  return wrapper;
  function wrapper(...args: any) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, time);
  }
}
export function convertEvmChainId(chainId: string) {
  const pattern = /(?<=0x)\d+/;
  if (!pattern.test(chainId)) {
    return "0x" + chainId;
  } else {
    return chainId;
  }
}

export function parseAptos(apt: string) {
  const calculatedApt = parseFloat(apt) * 100000000;
  return calculatedApt.toFixed().toString();
}

export function changeTargetName(chainName: string) {
  if (chainName === "ETH") return RegistryNetworkName.ETHEREUM_MAINNET_MAINNET;
  else if (chainName === "GETH")
    return RegistryNetworkName.ETHEREUM_TESTNET_GOERLI;
  else if (chainName === "BSC") return RegistryNetworkName.BNB_MAINNET_MAINNET;
  else if (chainName === "BSC_TESTNET")
    return RegistryNetworkName.BNB_TESTNET_TESTNET;
  else if (chainName === "ARBITRUM")
    return RegistryNetworkName.ARBITRUM_MAINNET_MAINNET;
  else if (chainName === "ARBITRUM_TESTNET")
    return RegistryNetworkName.ARBITRUM_TESTNET_GOERLI;
  else if (chainName === "POLYGON")
    return RegistryNetworkName.POLYGON_MAINNET_MAINNET;
  else if (chainName === "POLYGON_TESTNET")
    return RegistryNetworkName.POLYGON_TESTNET_MUMBAI;
  else if (chainName === "OPTIMISM")
    return RegistryNetworkName.OPTIMISM_MAINNET_MAINNET;
  else if (chainName === "OPTIMISM_TESTNET")
    return RegistryNetworkName.OPTIMISM_TESTNET_GOERLI;
  else if (chainName === "AVAX_CCHAIN")
    return RegistryNetworkName.AVALANCHE_MAINNET_CCHAIN;
  else if (chainName === "AVAX_CCHAIN_TESTNET")
    return RegistryNetworkName.AVALANCHE_TESTNET_FUJI;
  else if (chainName === "BTC")
    return RegistryNetworkName.BITCOIN_MAINNET_MAINNET;
  else if (chainName === "BTC_TESTNET")
    return RegistryNetworkName.BITCOIN_TESTNET_TESTNET;
  else if (chainName === "GNOSIS")
    return RegistryNetworkName.GNOSIS_MAINNET_MAINNET;
  else if (chainName === "GNOSIS_TESTNET")
    return RegistryNetworkName.GNOSIS_TESTNET_CHIADO;
  else if (chainName === "SHARDEUM")
    return RegistryNetworkName.SHARDEUM_BETANET_SPHINX;
  else if (chainName === "ZETA") return RegistryNetworkName.ZETA_TESTNET_ATHENS;
  else if (chainName === "SOLANA")
    return RegistryNetworkName.SOLANA_MAINNET_MAINNET;
  else if (chainName === "SOLANA_TESTNET")
    return RegistryNetworkName.SOLANA_TESTNET_TESTNET;
  else if (chainName === "APTOS")
    return RegistryNetworkName.APTOS_MAINNET_MAINNET;
  else if (chainName === "APTOS_TESTNET")
    return RegistryNetworkName.APTOS_TESTNET_TESTNET;
  else if (chainName === "SUI") return RegistryNetworkName.SUI_MAINNET_MAINNET;
  else if (chainName === "SUI_TESTNET")
    return RegistryNetworkName.SUI_TESTNET_TESTNET;
}
