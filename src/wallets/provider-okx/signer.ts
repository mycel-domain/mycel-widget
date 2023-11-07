import { DefaultEvmSigner } from "../../signers/signer-evm";
import { DefaultSolanaSigner } from "../../signers/signer-solana";
import { Networks, getNetworkInstance } from "../shared";
import {
  DefaultSignerFactory,
  SignerFactory,
  TransactionType as TxType,
} from "rango-types";

export default function getSigners(provider: any): SignerFactory {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  return signers;
}
