import { DefaultEvmSigner } from "../../signers/signer-evm";
import {
  DefaultSignerFactory,
  SignerFactory,
  TransactionType as TxType,
} from "../../types";

export default function getSigners(provider: any): SignerFactory {
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(provider));
  return signers;
}
