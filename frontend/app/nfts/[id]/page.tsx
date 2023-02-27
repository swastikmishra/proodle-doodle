import BreadCrumbs from "@/app/components/breadCrumbs";
import BuyButton from "@/app/components/buyButton";
import NftOnChainData from "@/app/components/nftOnChainData";
import Image from "next/image";
import Price from "@/app/components/price";
export const dynamic = 'force-dynamic';

export async function getNft(nftId: number) {
  let nft;
  await fetch(`${process.env.BACKEND_URL}/nfts/${nftId}`)
    .then((res) => res.json())
    .then((res) => {
      if (res.status == true) {
        nft = res.response.data;
      } else {
        throw new Error("Failed to connect to backend");
      }
    });
  return nft;
}

export default async function ({ params }) {
  const nftId: number = params.id;
  const nft = await getNft(nftId);
  return (
    <section>
      <div className="gap-4 items-center py-4 px-4 mx-auto max-w-screen-xl xl:gap-8 sm:py-8 lg:px-6">
        <BreadCrumbs nft={nft} />
        <div className="bg-white dark:bg-gray-900 w-full rounded-lg shadow-xl md:grid md:grid-cols-2">
          <Image
            alt={nft.name}
            src={nft.thumbnail}
            width={500}
            height={500}
            className="rounded-l-lg shadow-xl"
          />
          <div className="mt-4 md:mt-0 p-8">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              {nft.name}
            </h2>
            <p className="mb-6 font-light text-gray-500 md:text-lg dark:text-gray-400">
              {nft.description}
            </p>
            <Price price={nft.price} symbol={nft.symbol} />
            <br/>
            <BuyButton
              nft={nft}
              buyNowText={"Buy Now"}
              soldMessage={"Sold Out"}
            ></BuyButton>
          </div>
        </div>
      </div>
      <div className="bg-transparent gap-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-2 lg:px-6 mb-10">
        <NftOnChainData nft={nft} />
      </div>
    </section>
  );
}
