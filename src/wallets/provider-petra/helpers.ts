import type { Network } from '../shared';

type Provider = Map<Network, any>;

export function petraInstances(): Provider | null {
  // const instances: Provider = new Map();
  const { petra } = window;

  if (!petra) {
    return null;
  }

  return petra;
}
