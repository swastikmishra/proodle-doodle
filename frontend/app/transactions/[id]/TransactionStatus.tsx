"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function TransactionStatus(props) {
  const transactionId = props.transactionId;
  const [transaction, setTransaction] = useState(null);

  const getTransactionDetails = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction/${transactionId}/status`)
      .then((res) => res.json())
      .then((res) => {
        if (res.status) {
          setTransaction(res.response.data);
          if(res.response.data.transfers[0]){
            if(res.response.data.transfers[0].status != "Success" && res.response.data.transfers[0].status != "Failed"){
              setTimeout(getTransactionDetails, 1000*2);
            }
          }
        } else {
          alert(res.error);
        }
      });
  };

  const getSolanaLink = (url: string) => {
    return (
      <a
        className="text-teal-500"
        target="solaneyes"
        href={`https://www.solaneyes.com/address/${url}`}
      >
        {url}
      </a>
    );
  };

  useEffect(() => {
    if (!transaction) getTransactionDetails();
  }, []);

  return transaction ? (
    <section>
      <div className="gap-4 items-center py-4 px-4 mx-auto max-w-screen-xl xl:gap-8 sm:py-8 lg:px-6">
        <div className="bg-white dark:bg-gray-900 w-full rounded-lg shadow-xl md:grid md:grid-cols-2">
          <Image
            alt={transaction.nft.name}
            src={transaction.nft.thumbnail}
            width={500}
            height={500}
            className="rounded-l-lg shadow-xl"
          />
          <div className="mt-4 md:mt-0 p-8">
            {transaction.status == "Success" ? (
              <>
                <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                  Your purchase of <br />
                  {transaction.nft.name} <br /> is{" "}
                  <mark className="text-green-500 bg-transparent">
                    successfull
                  </mark>
                </h2>
                <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
                  Check below for transfer confirmation.
                </p>
              </>
            ) : transaction.status == "Failed" ? (
              <>
                <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                  Your purchase of <br />
                  {transaction.nft.name} <br /> has{" "}
                  <mark className="text-red-500 bg-transparent">failed</mark>
                </h2>
                <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
                  Sorry, can't do anything :(
                </p>
              </>
            ) : (
              <>
                <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                  Your purchase of <br />
                  {transaction.nft.name} <br /> is still{" "}
                  <mark className="text-yellow-500 bg-transparent">
                    pending
                  </mark>
                </h2>
                <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
                  There might be a delay in payment processing, please check
                  again later.
                </p>
              </>
            )}

            <p className="text-gray-500 dark:text-white mb-6">
              Price: {"  "}
              <span className="text-teal-500 font-bold">
                {transaction.nftPrice} {transaction.nft.symbol}
              </span>{" "}
              -{" "}
              <span className="text-green-500 font-bold">
                {transaction.salePrice} {transaction.saleCurrency}
              </span>
            </p>

            {transaction.transfers[0] ? (
              <div>
                <ol className="relative text-gray-500 border-l border-gray-200 dark:border-gray-700 dark:text-gray-400">
                  <li className="mb-10 ml-6">
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-green-500 dark:text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </span>
                    <h3 className="font-medium leading-tight">
                      NFT Transfer started
                    </h3>
                    <p className="text-sm">
                      {getSolanaLink(transaction.transfers[0].fromWallet)}{" "}
                      <br />
                      {getSolanaLink(transaction.transfers[0].toWallet)}
                    </p>
                  </li>
                  {transaction.transfers[0].status == "Success" ? (
                    <li className="mb-10 ml-6">
                      <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-green-500 dark:text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </span>

                      <h3 className="font-medium leading-tight">
                        NFT Transfer Completed
                      </h3>
                      <p className="text-sm truncate">
                        {getSolanaLink(transaction.transfers[0].signature)}
                      </p>
                    </li>
                  ) : (
                    <li className="mb-10 ml-6">
                      <span className="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-green-500 dark:text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </span>

                      <h3 className="font-medium leading-tight">
                        NFT Transfer in progress
                      </h3>
                      <p className="text-sm truncate">
                        {transaction.transfers[0].response}
                      </p>
                    </li>
                  )}
                </ol>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div className="bg-transparent gap-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-2 lg:px-6 mb-10"></div>
    </section>
  ) : (
    <section>
      <div className="gap-4 items-center py-4 px-4 mx-auto max-w-screen-xl xl:gap-8 sm:py-8 lg:px-6">
        <div className="bg-white dark:bg-gray-900 w-full rounded-lg shadow-xl md:grid md:grid-cols-2 p-12">
          <div role="status" className="max-w-sm animate-pulse">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
            <span className="sr-only">Loading...</span>
          </div>
          <div role="status" className="max-w-sm animate-pulse">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </section>
  );
}
