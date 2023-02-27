"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
const STRIPE_API_KEY = "pk_test_gfSLbLXSv8WNgPehTGc9zeCq";
const stripePromise = loadStripe(STRIPE_API_KEY);
// const STRIPE_API_KEY = process.env.STRIPE_API_KEY!;

export function CheckoutForm(props) {
  const stripe = useStripe();
  const elements = useElements();
  const [formSubmited, setFormSubmited] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormSubmited(true);

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: props.redirectUrl,
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      console.log(result);
    }

    setFormSubmited(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-white">
        Card Number: <code>4242 4242 4242 4242</code>
      </p>
      <p className="text-white">
        Expiry: <code>Any date from today</code> CVV: <code>121</code>
      </p>
      <PaymentElement />
      <button
        className="mt-6 w-full text-uppercase text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-md px-8 py-3 text-center inline-flex items-center mr-2 dark:bg-green-600 dark:hover:bg-green-500 dark:focus:ring-green-800 shadow-lg"
        disabled={!stripe && !formSubmited}
      >
        {formSubmited
          ? "Processing Payment"
          : `Pay ${props.amount} ${props.currency}`}
      </button>
    </form>
  );
}

export default function StripeCheckout(props) {
  const [clientSecret, setClientSecret] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null);

  useEffect(() => {
    if (clientSecret) return;
    document.documentElement.classList.add("embed");
    document.documentElement.classList.add("dark");
    setClientSecret(props.clientSecret);
    setRedirectUrl(props.redirectUrl);
  }, [clientSecret]);

  return (
    <section>
      <div className="gap-4 items-center py-4 px-4 mx-auto max-w-screen-sm xl:gap-8 sm:py-8 lg:px-6">
        {clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: clientSecret,
              appearance: {
                theme: "night",
                labels: "floating",
              },
            }}
          >
            <CheckoutForm
              amount={props.amount}
              currency={props.currency}
              redirectUrl={redirectUrl}
            />
          </Elements>
        )}
      </div>
    </section>
  );
}
