"use client";

import { SiConvertio } from "react-icons/si";
export default function price(props) {
  const getConvertedPrice = (price: number): string => {
    if (typeof localStorage !== "undefined" && localStorage) {
      let currentRate = localStorage.getItem("CurrentRate")
        ? parseFloat(localStorage.getItem("CurrentRate")!)
        : 1;
      return (currentRate * price).toFixed(2)
    }
    return price.toFixed(2);
  };

  return (
    <div className="flex text-blue-500 dark:text-blue-300 items-center">
      <span className="text-teal-500 font-bold">
        {props.price} {props.symbol}
      </span>{" "}
      <SiConvertio className="mr-2 ml-2" />
      <span className="text-green-500 font-bold">
        {getConvertedPrice(+props.price)} USD
      </span>
    </div>
  );
}
