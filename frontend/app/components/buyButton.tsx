"use client";

import { useState } from "react";
import ModalComponent from "./popups/ModalComponent";

export default function (props) {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setTimeout(() => {
      setShowModal(false);
      setTimeout(() => {
        setShowModal(true);
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
      <div>{showModal && <ModalComponent />}</div>
      <button
        onClick={openModal}
        type="button"
        className="text-uppercase text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-8 py-3 text-center inline-flex items-center mr-2 dark:bg-green-600 dark:hover:bg-green-500 dark:focus:ring-green-800 shadow-lg"
      >
        {props.buyNowText}
      </button>
    </>
  );
}
