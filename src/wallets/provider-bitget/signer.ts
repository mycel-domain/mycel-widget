import { DefaultEvmSigner } from "../../signers/signer-evm";
import { DefaultSolanaSigner } from "../../signers/signer-solana";
import { getNetworkInstance, Networks } from "../shared";
import { DefaultAptosSigner } from "../../signers/signer-aptos";
import {
  SignerFactory,
  DefaultSignerFactory,
  TransactionType as TxType,
} from "../../types";
import { DefaultSuiSigner } from "../../signers/signer-sui";

export default function getSigners(provider: any): SignerFactory {
  const ethProvider = getNetworkInstance(provider, Networks.ETHEREUM);
  const solProvidper = getNetworkInstance(provider, Networks.SOLANA);
  const aptProvider = getNetworkInstance(provider, Networks.APTOS);
  const suiProvider = getNetworkInstance(provider, Networks.SUI);

  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  signers.registerSigner(TxType.SOLANA, new DefaultSolanaSigner(solProvidper));
  signers.registerSigner(TxType.APTOS, new DefaultAptosSigner(aptProvider));
  signers.registerSigner(TxType.SUI, new DefaultSuiSigner(suiProvider));

  return signers;
}
