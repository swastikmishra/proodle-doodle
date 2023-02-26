import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { NFT, NFTStatus, PrismaClient, Transaction } from "@prisma/client";
import { getPaginationFromQuery } from "./helpers/Paginator.js";
import {
  RequestBodyNFTCheckout,
  RequestGetNFT,
  RequestGetNFTsQuery,
  RequestGetTransactionStatus,
  RequestPostNFTConfirmTransaction,
} from "./helpers/RequestType.js";
import { sendResponse } from "./helpers/Response.js";
import { getNFT, getNFTs } from "./controllers/NFTs.js";
import {
  createPaymentIntent,
  validateNFTCheckout,
} from "./controllers/Checkout.js";
import Stripe from "stripe";
import { getTransaction } from "./controllers/Transaction.js";

const prisma = new PrismaClient();
const app = fastify();

const appPort = parseInt(process.env.BACKEND_PORT!);

app.get(
  "/nfts",
  async (
    request: FastifyRequest<{ Querystring: RequestGetNFTsQuery }>,
    reply: FastifyReply
  ) => {
    try {
      const pagination = getPaginationFromQuery(request.query);
      const nfts = await getNFTs(pagination.skip, pagination.offset);
      return sendResponse(reply, {
        data: nfts,
        pagination: {
          nextPage: pagination.nextPage,
          offset: pagination.offset,
        },
      });
    } catch (err) {
      return sendResponse(reply, "Failed to get NFTs", true, 500);
    }
  }
);

app.get(
  "/nfts/:id",
  async (request: FastifyRequest<{ Params: RequestGetNFT }>, reply) => {
    try {
      const nftId: Number = request.params.id;
      const nft: NFT | null = await getNFT(+nftId);
      if (nft) {
        return sendResponse(reply, {
          data: {
            id: nft.id,
            mint: nft.mint,
            name: nft.name,
            symbol: nft.symbol,
            price: nft.price,
            chain: nft.chain,
            createdAt: nft.createdAt,
            updatedAt: nft.updatedAt,
            status: nft.status,
            thumbnail: nft.thumbnail,
            attributes: nft.attributes,
            description: nft.description,
          },
        });
      } else {
        return sendResponse(reply, "No NFT Found", true, 404);
      }
    } catch (err) {
      return sendResponse(reply, "Failed to get NFT", true, 500);
    }
  }
);

app.post(
  "/nfts/:id/checkout",
  async (
    request: FastifyRequest<{
      Params: RequestGetNFT;
      Body: RequestBodyNFTCheckout;
    }>,
    reply: FastifyReply
  ) => {
    const nftId: Number = request.params.id;
    try {
      const nft: NFT | null = await getNFT(+nftId);

      if (!nft) {
        return sendResponse(reply, "No NFT Found", true, 404);
      }

      const error = validateNFTCheckout(nft);

      if (error) {
        return sendResponse(reply, error, true);
      }

      const currency: string = request.body.currency;
      const email: string | null = request.body.email
        ? request.body.email.toString()
        : null;
      const wallet: string | null = request.body.wallet
        ? request.body.wallet.toString()
        : null;

      const {
        paymentIntent,
        transaction,
      }: {
        paymentIntent: Stripe.Response<Stripe.PaymentIntent>;
        transaction: Transaction;
      } = await createPaymentIntent(nft, currency, email, wallet);

      if (paymentIntent && transaction)
        sendResponse(reply, {
          transactionId: transaction.id,
          client_secret: paymentIntent.client_secret,
        });

      else throw new Error("Failed to create payment intent");
    } catch (error) {
      console.error(error);
      return sendResponse(reply, "Failed to get NFT data", true, 500);
    }
  }
);

app.post(
  "/transaction/:id/checkout/:intent",
  async (
    request: FastifyRequest<{
      Params: RequestPostNFTConfirmTransaction;
    }>,
    reply: FastifyReply
  ) => {
    const txnId: Number = request.params.id;
    const intent: string = request.params.intent;

    try {
      const transaction: Transaction | null = await getTransaction(+txnId);

      if (!transaction) {
        return sendResponse(reply, "No Transaction Found", true, 404);
      }

      const nft: NFT | null = await getNFT(+transaction.nftId);

      if (!nft) {
        return sendResponse(reply, "No NFT Found", true, 404);
      }

      const error = validateNFTCheckout(nft);

      if (error) {
        return sendResponse(
          reply,
          "NFT not available for sale anymore. You card hasn't been charged.",
          true
        );
      }
    } catch (error) {
      console.error(error);
      return sendResponse(reply, "Failed to confirm payment", true, 500);
    }
  }
);

app.get(
  "/transaction/:id/status",
  async (
    request: FastifyRequest<{
      Params: RequestGetTransactionStatus;
    }>,
    reply: FastifyReply
  ) => {
    const txnId: Number = request.params.id;

    try {
      const transaction: Transaction | null = await getTransaction(+txnId);

      if (!transaction) {
        return sendResponse(reply, "No Transaction Found", true, 404);
      }
    } catch (error) {
      console.error(error);
      return sendResponse(reply, "Failed to confirm payment", true, 500);
    }
  }
);

app.listen({ port: appPort, host: "0.0.0.0" }, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`Server listening at ${process.env.BACKEND_PORT}`);
});
