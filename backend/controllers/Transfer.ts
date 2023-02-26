import {
  Chain,
  NFT,
  PrismaClient,
  Transaction,
  Transfer,
  TxnStatus,
} from "@prisma/client";
import { SolanaTransferNFT } from "./Solana.js";
const prisma = new PrismaClient();

export const createTransfer = async (
  nft: NFT,
  transaction: Transaction
): Promise<Transfer | null> => {
  return await prisma.transfer.create({
    data: {
      nftId: nft.id,
      fromWallet: process.env.SOLANA_FILE_WALLET!,
      toWallet: transaction.wallet
        ? transaction.wallet
        : process.env.SOLANA_FILE_DUMP_WALLET!,
      status: TxnStatus.Pending,
      response:
        "Starting Transfer from " +
        process.env.SOLANA_FILE_WALLET +
        " to " +
        transaction.wallet,
      transactionsId: transaction.id,
      chain: nft.chain,
    },
  });
};

export const startWalletTransfer = async (
  nft: NFT,
  transaction: Transaction
): Promise<void> => {
  try {
    let transfer: Transfer | null = await createTransfer(nft, transaction);
    if (!transfer) {
      throw new Error("Failed to start transfer");
    }

    switch (nft.chain) {
      case Chain.Solana:
        SolanaTransferNFT(nft.mint, transfer.toWallet, transfer.toWallet);
        break;
      default:
        throw new Error("We don't support non Solana transfers right now");
    }
  } catch (err) {
    console.error(err);
    throw new Error("Failed to start transfer");
  }
};
