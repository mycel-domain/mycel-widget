import { Networks, ProviderConnectResult } from "../shared";

export function okx_instance() {
  const { okxwallet } = window;
  if (!okxwallet) return null;
  const instances = new Map();
  if (okxwallet) instances.set(Networks.ETHEREUM, okxwallet);
  if (okxwallet.solana) instances.set(Networks.SOLANA, okxwallet.solana);

  return instances;
}

export async function getSolanaAccounts(
  instance: any
): Promise<ProviderConnectResult[]> {
  const solanaInstance = await instance.get(Networks.SOLANA);
  const results: ProviderConnectResult[] = [];

  if (solanaInstance) {
    const solanaResponse = await solanaInstance.connect();
    const account = solanaResponse.publicKey.toString();

    results.push({
      accounts: account ? [account] : [],
      chainId: Networks.SOLANA,
    });
  }

  return results;
}
