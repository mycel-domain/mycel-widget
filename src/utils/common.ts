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
