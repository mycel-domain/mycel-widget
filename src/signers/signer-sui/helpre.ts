import type { GenericSigner, TronTransaction } from '../../types';
import {Types} from 'aptos'

import { SignerError, SignerErrorCode } from '../../types';

// TODO - replace with real type
// tslint:disable-next-line: no-any
type SuiExternalProvider = any;

export class DefaultSuiSigner implements GenericSigner<TronTransaction> {
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

  async signAndSendTx(tx: TronTransaction): Promise<{ hash: string }> {
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
        console.log('error', error)
        throw errMsg;
      }
    }


  static buildTx(tronTx: TronTransaction) {
    let tx = {};
    if (!!tronTx.txID) tx = { ...tx, txID: tronTx.txID };
    if (tronTx.visible !== undefined) tx = { ...tx, visible: tronTx.visible };
    if (!!tronTx.__payload__) tx = { ...tx, __payload__: tronTx.__payload__ };
    if (!!tronTx.raw_data) tx = { ...tx, raw_data: tronTx.raw_data };
    if (!!tronTx.raw_data_hex)
      tx = { ...tx, raw_data_hex: tronTx.raw_data_hex };
    return tx;
  }
}
