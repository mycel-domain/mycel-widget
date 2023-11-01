import type { Network } from '../shared';

import { Networks } from '../shared';

type Provider = Map<Network, any>;

export function suiWalletInstances(): Provider | null {
  // const instances: Provider = new Map();
  const { suiWallet } = window;

  if (!suiWallet) {
    return null;
  }

  return suiWallet;
}
