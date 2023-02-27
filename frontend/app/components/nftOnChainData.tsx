"use client";

import { useEffect, useState } from "react";
import { IoAnalyticsOutline } from "react-icons/io5";
import NftOnChainLoadingSkeleton from "./nftOnChainLoadingSkeleton";
import { Metaplex } from "@metaplex-foundation/js";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { CgMediaLive } from "react-icons/cg";

export default function (props: any) {
  const [nft, setNFT] = useState();

  //   const connection = new Connection(process.env.SOLANA_CLUSTER_RPC!);
  const connection = new Connection(clusterApiUrl("devnet"));
  const metaplex = new Metaplex(connection);

  const getSolanaLink = (url: string) => {
    return `https://www.solaneyes.com/address/${url}`;
  };

  useEffect(() => {
    metaplex
      .nfts()
      .findByMint({ mintAddress: new PublicKey(props.nft.mint) })
      .then((nft) => {
        setNFT(nft);
      });
  }, [props]);

  return nft ? (
    <>
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow sm:p-4 dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-xl">
        <h2 className="dark:text-white flex items-center text-lg">
          <IoAnalyticsOutline className="mr-2" /> Rarity
        </h2>
        <div className="flow-root">
          <div
            role="list"
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            {nft.json.attributes.map((attr, key) => {
              return (
                <p key={key} className="sm:py-2 justify-between flex">
                  <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {attr.trait_type.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500 truncate dark:text-gray-400 text-right">
                    {attr.value}
                  </span>
                </p>
              );
            })}
          </div>
        </div>
      </div>
      <div className="w-full bg-white border border-gray-200 rounded-lg shadow sm:p-4 dark:bg-gray-800 dark:border-gray-700 rounded-lg shadow-xl">
        <h2 className="dark:text-white flex items-center text-lg">
          <CgMediaLive className="mr-2" /> On Chain Data
        </h2>
        <div className="flow-root">
          <div
            role="list"
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            <p className="sm:py-2 justify-between flex">
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                Mint
              </span>
              <span className="text-sm text-gray-500 truncate dark:text-gray-400 text-right">
                <a
                  className="text-teal-500 dark:text-teal-400"
                  target="solaneyes"
                  href={getSolanaLink(nft.mint.address.toString())}
                >
                  {nft.mint.address.toString()}
                </a>
              </span>
            </p>
            <p className="sm:py-2 justify-between flex">
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                Update Authority
              </span>
              <span className="text-sm text-gray-500 truncate dark:text-gray-400 text-right">
                <a
                  className="text-teal-500 dark:text-teal-400"
                  target="solaneyes"
                  href={getSolanaLink(nft.updateAuthorityAddress.toString())}
                >
                  {nft.updateAuthorityAddress.toString()}
                </a>
              </span>
            </p>
            <p className="sm:py-2 justify-between flex">
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                Creator
              </span>
              <span className="text-sm text-gray-500 truncate dark:text-gray-400 text-right">
                <a
                  className="text-teal-500 dark:text-teal-400"
                  target="solaneyes"
                  href={getSolanaLink(nft.creators[1].address.toString())}
                >
                  {nft.creators[1].address.toString()} ({nft.creators[1].share}
                  %)
                </a>
              </span>
            </p>
            <p className="sm:py-2 justify-between flex">
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                Collection
              </span>
              <span className="text-sm text-gray-500 truncate dark:text-gray-400 text-right">
                <a
                  className="text-teal-500 dark:text-teal-400"
                  target="solaneyes"
                  href={getSolanaLink(nft.collection.address.toString())}
                >
                  {nft.collection.address.toString()}
                </a>
              </span>
            </p>
            <p className="sm:py-2 justify-between flex">
              <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
                Royalty
              </span>
              <span className="text-sm text-gray-500 truncate dark:text-gray-400 text-right">
                {nft.sellerFeeBasisPoints / 100}%
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  ) : (
    <NftOnChainLoadingSkeleton />
  );
}
