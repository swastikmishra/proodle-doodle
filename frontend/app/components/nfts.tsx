import Image from "next/image";
import { Suspense } from "react";
import NFTsSkeleton from "./nftsSkeleton";
import Link from "next/link";
import Price from "@/app/components/price";
import BuyButton from "./buyButton";
async function getNFTs() {
  let nfts;
  let pagination;
  await fetch(`http://172.17.0.1:3001/nfts?nextPage=1&offset=20`)
    .then((res) => res.json())
    .then((res) => {
      if (res.status == true) {
        nfts = res.response.data;
        pagination = res.response.pagination;
      } else {
        throw new Error("Failed to connect to backend");
      }
    });
  return nfts;
}

export default async function () {
  let nfts: Array<object> | undefined;
  nfts = await getNFTs();

  return (
    <section id="nfts" className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
        <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-4">
          <Suspense fallback={<NFTsSkeleton />}>
            {nfts &&
              nfts!.map((nft: object) => {
                return (
                  <div
                    key={nft.id}
                    className="items-center bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700 flex-col overflow-hidden shadow-lg"
                  >
                    <Link href={`/nfts/${nft.id}`} className="w-full">
                      <Image
                        src={nft.thumbnail}
                        alt={nft.name}
                        width={500}
                        height={500}
                      />
                    </Link>
                    <div className="p-5 w-full">
                      <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                        <Link href={`/nfts/${nft.id}`} className="w-full">
                          {nft.name}
                        </Link>
                      </h3>
                      <div className="flex flex-row justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          {nft.chain}
                        </span>
                        <Price price={nft.price} symbol={nft.symbol}/>
                      </div>
                      <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400 h-[100px]">
                        {nft.description}
                      </p>
                      <BuyButton nft={nft} buyNowText={"Buy Now"} soldMessage={"Sold Already"}></BuyButton>
                    </div>
                  </div>
                );
              })}
          </Suspense>
        </div>
      </div>
    </section>
  );
}
