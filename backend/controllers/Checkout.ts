import {
  NFT,
  NFTStatus,
  PrismaClient,
  Transaction,
  TxnStatus,
} from "@prisma/client";
import Stripe from "stripe";
import { convertCurrency } from "../helpers/PriceConverter.js";
import { getNFT, updateNFTStatus } from "./NFTs.js";
import {
  createTransactionEntry,
  updateTransactionStatus,
} from "./Transaction.js";
import { startWalletTransfer } from "./Transfer.js";
const prisma = new PrismaClient();

const stripeClient = new Stripe(process.env?.STRIPE_API_SECRET!, {
  apiVersion: "2022-11-15",
});

export const validateNFTCheckout = (nft: NFT): string | null => {
  if (nft.status == NFTStatus.Sold) {
    return "NFT is already sold";
  }

  if (nft.status == NFTStatus.Reserved) {
    return "NFT is not available for sale right now, please try again later";
  }

  if (nft.status != NFTStatus.Available) {
    //danger, do something, this should never be the case
    return "NFT is not available for sale right now, please try again later";
  }

  return null;
};

export const createPaymentIntent = async (
  nft: NFT,
  currency: string,
  email: string | null,
  wallet: string | null
): Promise<{
  paymentIntent: Stripe.Response<Stripe.PaymentIntent>;
  transaction: Transaction;
}> => {
  let stripeCustomer: Stripe.Customer | null;
  if (email) {
    try {
      stripeCustomer = await stripeClient.customers.create({
        email: email,
      });
    } catch (err) {
      throw new Error("Couldn't create customer");
    }
  }

  try {
    let salePrice: number = await convertCurrency(+nft.price, nft.symbol, currency);
    let paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: +(salePrice * 100).toFixed(0),
      currency: currency,
      automatic_payment_methods: { enabled: true },
      description: `Purchase of ${nft.name}`,
      capture_method: "manual", //we will capture, post card details are verified
    };
    if (stripeCustomer!) {
      paymentIntentParams.customer = stripeCustomer.id;
    }

    const paymentIntent = await stripeClient.paymentIntents.create(
      paymentIntentParams
    );

    const transaction = await createTransactionEntry(
      nft,
      paymentIntent.id,
      currency,
      +nft.price,
      salePrice,
      email,
      wallet
    );

    return { paymentIntent, transaction };
  } catch (err) {
    console.error(err);
    throw new Error("Couldn't create payment intent");
  }
};

export const confirmAndCapturePayment = async (
  transaction: Transaction,
  intent: string,
  nft: NFT
): Promise<boolean> => {
  let paymentIntent: Stripe.PaymentIntent | null;
  try {
    paymentIntent = await stripeClient.paymentIntents.retrieve(intent);
    if (!paymentIntent) {
      throw new Error("Cannot verify transaction");
    }
  } catch (err) {
    console.error(err);
    throw new Error("Cannot verify transaction");
  }

  //reserve the nft, and then capture the payment
  try {
    updateNFTStatus(nft.id, NFTStatus.Reserved);
    const captureStatus: Stripe.PaymentIntent =
      await stripeClient.paymentIntents.capture(intent);

    if (captureStatus.status === "canceled") {
      updateNFTStatus(nft.id, NFTStatus.Available);
      updateTransactionStatus(nft, intent, TxnStatus.Failed);
      throw new Error("Failed to process payment");
    }

    if (captureStatus.status !== "succeeded") {
      updateNFTStatus(nft.id, NFTStatus.Available);
      updateTransactionStatus(nft, intent, TxnStatus.Processing);
      throw new Error("Failed to process payment");
    }

    //the transaction succeeded, time to start the nft transfer
    await updateNFTStatus(nft.id, NFTStatus.Sold);
    await updateTransactionStatus(
      nft,
      intent,
      TxnStatus.Success,
      captureStatus.latest_charge?.toString()
    );
    startWalletTransfer(nft, transaction);

    return true;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to process payment");
  }
};
