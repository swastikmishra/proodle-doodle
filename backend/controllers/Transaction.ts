import { NFT, PrismaClient, Transaction, TxnStatus } from "@prisma/client";
const prisma = new PrismaClient();

export const createTransactionEntry = async (
  nft: NFT,
  paymentIntentId: string,
  currency: string,
  nftPrice: number,
  salePrice: number,
  email: string | null,
  wallet: string | null
): Promise<Transaction> => {
  if (!email) {
    email = "";
  }

  try {
    return await prisma.transaction.create({
      data: {
        nftId: nft.id,
        paymentIntent: paymentIntentId,
        status: TxnStatus.Pending,
        buyerEmail: email,
        nftPrice: nftPrice,
        salePrice: salePrice,
        saleCurrency: currency,
        wallet: wallet,
      },
    });
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create transaction");
  }
};

export const updateTransactionStatus = async (
  nft: NFT,
  paymentIntentId: string,
  status: TxnStatus,
  txnId?: string | null,
  remarks?: string | null
): Promise<Transaction> => {
  if (!txnId) txnId = undefined;
  if (!remarks) remarks = "";

  return await prisma.transaction.update({
    where: {
      paymentIntent: paymentIntentId,
    },
    data: {
      status: status,
      paymentTimestamp: new Date().toISOString(),
      externalTxnId: txnId,
      response: remarks,
    },
  });
};

export const getTransaction = async (
  txnId: number
): Promise<Transaction | null> => {
  return await prisma.transaction.findUnique({
    where: {
      id: +txnId,
    },
  });
};
