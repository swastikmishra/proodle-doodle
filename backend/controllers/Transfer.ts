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
  let toWallet = transaction.wallet
    ? transaction.wallet
    : process.env.SOLANA_FILE_DUMP_WALLET!;
  return await prisma.transfer.create({
    data: {
      nftId: nft.id,
      fromWallet: process.env.SOLANA_FILE_WALLET!,
      toWallet: toWallet,
      status: TxnStatus.Pending,
      response:
        "Starting Transfer from " +
        process.env.SOLANA_FILE_WALLET +
        " to " +
        toWallet,
      transactionsId: transaction.id,
      chain: nft.chain,
    },
  });
};

export const updateTransfer = async (
  transfer: Transfer,
  updates: { status: TxnStatus; response: string; signature?: string | null }
): Promise<Transfer | null> => {
  return await prisma.transfer.update({
    where: {
      id: transfer.id,
    },
    data: {
      status: updates.status,
      response: transfer.response + "\n" + updates.response,
      signature: updates.signature ? updates.signature : "",
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
    let response = null;
    switch (nft.chain) {
      case Chain.Solana:
        response = await SolanaTransferNFT(
          nft.mint,
          transfer.fromWallet,
          transfer.toWallet
        );
        break;
      default:
        throw new Error("We don't support non Solana transfers right now");
    }

    if (response) {
      console.dir(response, { depth: null });
      updateTransfer(transfer, {
        response: "Transfer Completed\n" + JSON.stringify(response.response),
        status: TxnStatus.Success,
        signature: response.response.signature,
      });
    } else {
      updateTransfer(transfer, {
        response: "Failed to transfer NFT",
        status: TxnStatus.Failed,
      });
    }
  } catch (err) {
    console.error(err);
    throw new Error("Failed to start transfer");
  }
};