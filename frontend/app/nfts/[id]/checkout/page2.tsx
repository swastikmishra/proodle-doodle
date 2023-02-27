"use client";
"use strict";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
// const STRIPE_API_KEY = process.env.STRIPE_API_KEY!;
const STRIPE_API_KEY = "pk_test_gfSLbLXSv8WNgPehTGc9zeCq";

export const metadata = {
  title: "Checkout",
};

function CheckoutForm(props) {
  const stripe = useStripe();
  const elements = useElements();
  const [formSubmited, setFormSubmited] = useState(false)
  const redirectUrl = props.redirectUrl

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormSubmited(true)

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: redirectUrl,
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      console.log(result);
    }

    setFormSubmited(false)
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-white">Card Number: <code>4242 4242 4242 4242</code></p>
      <p className="text-white">Expiry: <code>Any date from today</code> CVV: <code>121</code></p>
      <PaymentElement />
      <button
        className="mt-6 w-full text-uppercase text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-8 py-3 text-center inline-flex items-center mr-2 dark:bg-green-600 dark:hover:bg-green-500 dark:focus:ring-green-800 shadow-lg"
        disabled={!stripe && !formSubmited}
      >
        {formSubmited ? "Processing Payment" : "Submit"}
      </button>
    </form>
  );
}

const stripePromise = loadStripe(STRIPE_API_KEY);

export default function ({ params }) {
  const nftId: number = params.id;
  const [nft, setNft] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [stripeClientSecret, setStripeClientSecret] = useState(null);
  const [wallet, setWallet] = useState(null);

  const getNft = () => {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/nfts/${nftId}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.status == true) {
            resolve(res.response.data);
          } else {
            reject(res.error);
          }
        });
    });
  };

  const createTransaction = () => {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/nfts/${nftId}/checkout`, {
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
            resolve(res.response);
          } else {
            reject(res.error);
          }
        });
    });
  };

  useEffect(() => {
    if (stripeClientSecret) return;
    document.documentElement.classList.add("embed");
    document.documentElement.classList.add("dark");
    getNft()
      .then((nft) => setNft(nft))
      .then(() => {
        if(transactionId) return;
        createTransaction().then((res) => {
          setTransactionId(res.transactionId);
          setStripeClientSecret(res.client_secret);
        });
      })
      .catch((err) => alert);
  }, [stripeClientSecret]);

  return (
    <section>
      <div className="gap-4 items-center py-4 px-4 mx-auto max-w-screen-sm xl:gap-8 sm:py-8 lg:px-6">
        {stripeClientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: stripeClientSecret,
              appearance: {
                theme: "night",
                labels: "floating",
              },
            }}
          >
            <CheckoutForm redirectUrl={`${window.location.origin}/transactions/${transactionId}`} />
          </Elements>
        )}
      </div>
    </section>
  );
}
