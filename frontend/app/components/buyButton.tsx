"use client";

import { useState } from "react";
import WalletConfirmation from "./popups/WalletConfirmation";
import { useRouter } from "next/navigation";
import CheckoutFrame from "./popups/checkoutFrame";

export default function (props: any) {
  const router = useRouter();
  const [showConnectWalletPopup, setConnectWalletPopup] = useState(false);
  const [showCheckoutPopup, setCheckoutPopup] = useState(false);

  const onWalletSkip = () => {
    if (props.nft.id) {
      // router.push(`/nfts/${props.nft.id}/checkout`)
      setTimeout(() => {
        setCheckoutPopup(false);
        setTimeout(() => {
          setCheckoutPopup(true);
          setConnectWalletPopup(false);
        }, 10);
      }, 10);
    }
  };

  const onWalletConnect = () => {
    console.log("Wallet Connection Clicked");
  };

  const openCheckoutModal = () => {};

  const openModal = () => {
    setTimeout(() => {
      setCheckoutPopup(false);
      setConnectWalletPopup(false);
      setTimeout(() => {
        setConnectWalletPopup(true);
      }, 10);
    }, 10);
  };

  return props.nft.status != "Available" ? (
    <button
      type="button"
      className="cursor-not-allowed text-uppercase text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-8 py-3 text-center inline-flex items-center mr-2 dark:bg-red-600 dark:hover:bg-red-500 dark:focus:ring-red-800 shadow-lg"
    >
      {props.soldMessage}
    </button>
  ) : (
    <>
      {showConnectWalletPopup && (
        <WalletConfirmation
          onSkip={onWalletSkip}
          onConnect={onWalletConnect}
          isOpen={showConnectWalletPopup}
          onClose={() => setConnectWalletPopup(false)}
        />
      )}
      {showCheckoutPopup && (
        <CheckoutFrame
          isOpen={showCheckoutPopup}
          checkoutUrl={`/nfts/${props.nft.id}/checkout`}
          onClose={() => setCheckoutPopup(false)}
        />
      )}
      <button
        onClick={onWalletSkip}
        type="button"
        className="text-uppercase text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-8 py-3 text-center inline-flex items-center mr-2 dark:bg-green-600 dark:hover:bg-green-500 dark:focus:ring-green-800 shadow-lg"
      >
        {props.buyNowText}
      </button>
    </>
  );
}
