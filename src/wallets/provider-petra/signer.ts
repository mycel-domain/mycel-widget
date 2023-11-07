import { getNetworkInstance, Networks } from "../shared";
import { DefaultAptosSigner } from "../../signers/signer-aptos";
import {
  SignerFactory,
  DefaultSignerFactory,
  TransactionType as TxType,
} from "../../types";

export default function getSigners(provider: any): SignerFactory {
  const aptProvider = getNetworkInstance(provider, Networks.APTOS);

  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.APTOS, new DefaultAptosSigner(aptProvider));

  return signers;
}
