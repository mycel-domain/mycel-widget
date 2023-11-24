import { DefaultSolanaSigner } from "../../signers/signer-solana";
import { Networks, getNetworkInstance } from "../shared";
import {
  DefaultSignerFactory,
  SignerFactory,
  TransactionType as TxType,
} from "../../types";

export default function getSigners(provider: any): SignerFactory {
  const solProvider = getNetworkInstance(provider, Networks.SOLANA);
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvider));
  return signers;
}
