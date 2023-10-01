import type { GenericSigner } from '../../types';
import {Types} from 'aptos'

import { SignerError, SignerErrorCode } from '../../types';
import { SuiTransaction } from '../../types/api/shared/txs/sui';

// TODO - replace with real type
// tslint:disable-next-line: no-any
type SuiExternalProvider = any;

export class DefaultSuiSigner implements GenericSigner<SuiTransaction> {
  private provider: SuiExternalProvider;

  constructor(provider: SuiExternalProvider) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signTransaction(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: SuiTransaction): Promise<{ hash: string }> {
    try {
      const transaction = DefaultSuiSigner.buildTx(tx);
      const signedTxn = await this.provider.tronWeb.trx.sign(transaction);
      const receipt = await this.provider.tronWeb.trx.sendRawTransaction(
        signedTxn
      );
      const hash = receipt?.transaction?.txID;
      return { hash };
    } catch (error) {
      throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error);
    }
  }

    async signAndSubmitTransaction(
    transaction: Types.TransactionPayload,
    options?: any
  ): Promise<{ hash: Types.HexEncodedBytes }> {
    try {
      const response = await this.provider?.signAndSubmitTransaction(
        transaction,
        options
      );
      // if ((response as AptosWalletErrorResult).code) {
      //   throw new Error((response as AptosWalletErrorResult).message);
      // }
      return response as { hash: Types.HexEncodedBytes };
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }


  static buildTx(suiTx: SuiTransaction) {
    return suiTx;
  }
}
