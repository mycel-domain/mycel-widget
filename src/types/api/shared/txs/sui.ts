import { TransactionType } from "../transactions.js";
import { BaseTransaction } from "./base.js";

/**
 * Account metadata used to define instructions
 */
export type SuiInstructionKey = {
  pubkey: string;
  isSigner: boolean;
  isWritable: boolean;
};

/**
 * Transaction Instruction class
 */
export type SuiInstruction = {
  keys: SuiInstructionKey[];
  programId: string;
  data: number[];
};

/**
 * Pair of signature and corresponding public key
 */
export type SuiSignature = {
  signature: number[];
  publicKey: string;
};

/**
 * This type of transaction is used for all solana transactions
 *
 * @property {TransactionType} type - This fields equals to SOLANA for all SuiTransactions
 * @property {'LEGACY' | 'VERSIONED'} txType - Type of the solana transaction
 * @property {string} blockChain, equals to SUI
 * @property {string} from, Source wallet address
 * @property {string} identifier, Transaction hash used in case of retry
 * @property {string | null} recentBlockhash, A recent blockhash
 * @property {SuiSignature[]} signatures, Signatures for the transaction
 * @property {number[] | null} serializedMessage, The byte array of the transaction
 * @property {SuiInstruction[]} instructions, The instructions to atomically execute
 *
 */
export interface SuiTransaction extends BaseTransaction {
  type: TransactionType.SUI;
  txType: "LEGACY" | "VERSIONED";
  from: string;
  identifier: string;
  recentBlockhash: string | null;
  signatures: SuiSignature[];
  serializedMessage: number[] | null;
  instructions: SuiInstruction[];
}

export const isSuiTransaction = (transaction: {
  type: TransactionType;
}): transaction is SuiTransaction => transaction.type === TransactionType.SUI;
