import { TransactionType } from "../transactions.js";
import { BaseTransaction } from "./base.js";

/**
 * Account metadata used to define instructions
 */
export type AptosInstructionKey = {
  pubkey: string;
  isSigner: boolean;
  isWritable: boolean;
};

/**
 * Transaction Instruction class
 */
export type AptosInstruction = {
  keys: AptosInstructionKey[];
  programId: string;
  data: number[];
};

/**
 * Pair of signature and corresponding public key
 */
export type AptosSignature = {
  signature: number[];
  publicKey: string;
};

/**
 * This type of transaction is used for all solana transactions
 *
 * @property {TransactionType} type - This fields equals to APTOS for all SolanaTransactions
 * @property {'LEGACY' | 'VERSIONED'} txType - Type of the solana transaction
 * @property {string} blockChain, equals to APTOS
 * @property {string} from, Source wallet address
 * @property {string} identifier, Transaction hash used in case of retry
 * @property {string | null} recentBlockhash, A recent blockhash
 * @property {SolanaSignature[]} signatures, Signatures for the transaction
 * @property {number[] | null} serializedMessage, The byte array of the transaction
 * @property {SolanaInstruction[]} instructions, The instructions to atomically execute
 *
 */
export interface AptosTransaction extends BaseTransaction {
  type: TransactionType.APTOS;
  txType: "LEGACY" | "VERSIONED";
  from: string;
  identifier: string;
  recentBlockhash: string | null;
  signatures: AptosSignature[];
  serializedMessage: number[] | null;
  instructions: AptosInstruction[];
}

export const isAptosTransaction = (transaction: {
  type: TransactionType;
}): transaction is AptosTransaction =>
  transaction.type === TransactionType.APTOS;
