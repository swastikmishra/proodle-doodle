import { getNft } from "./page";

export default async function Head({ params }: { params: { id: number } }) {
  let id = params.id;
  let nft = await getNft(id);
  return (
    <>
      <title>{`Buy NFT - ${nft.name}`}</title>
    </>
  );
}
