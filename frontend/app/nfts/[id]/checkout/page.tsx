import StripeCheckout from "./StripeCheckout";
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Checkout",
};

const getNft = async (nftId: number) => {
  let nft;
  await fetch(`${process.env.BACKEND_URL}/nfts/${nftId}`)
    .then((res) => res.json())
    .then((res) => {
      if (res.status == true) {
        nft = res.response.data;
      } else {
        throw new Error("Failed to connect with backend");
      }
    });
  return nft;
};

const createTransaction = async (nftId: number) => {
  let response;
  await fetch(`${process.env.BACKEND_URL}/nfts/${nftId}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currency: "USD",
      wallet: null,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status == true) {
        response = res.response;
      } else {
        throw new Error("Failed to create transaction");
      }
    });
  return response;
};

export default async function ({ params }) {
  const nftId: number = params.id;
  const nft = await getNft(nftId);
  const createResponse = await createTransaction(nftId);
  return createResponse.client_secret ? (
    <StripeCheckout
      redirectUrl={`${process.env.NEXT_PUBLIC_APP_URL}/transactions/${createResponse.transactionId}`}
      clientSecret={createResponse.client_secret}
      transactionId={createResponse.transactionId}
      amount={createResponse.transactionAmount}
      currency={createResponse.transactionCurrency}
    />
  ) : (
    <></>
  );
}
