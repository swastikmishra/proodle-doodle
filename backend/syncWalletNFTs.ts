import { Metadata, Metaplex, Nft, PublicKey } from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import sharp from "sharp";
import fetch from "node-fetch";
import { S3 } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
const s3 = new S3({
  region: "ap-southeast-1",
});
const connection = new Connection(process.env.SOLANA_CLUSTER_RPC!);
const metaplex = new Metaplex(connection);

const FileWallet: PublicKey = new PublicKey(process.env.SOLANA_FILE_WALLET!);

const nfts = await metaplex.nfts().findAllByOwner({
  owner: FileWallet,
});

interface NFTObject {
  mint: string;
  name: string;
  symbol: string;
  price: number;
  image: string;
  thumbnail: string;
  description: string;
  attributes: object;
}

nfts.forEach(async (metadata) => {
  metadata = metadata as Metadata;
  let mintAddress = metadata.mintAddress!.toString();
  const token = await prisma.nFT.findUnique({
    where: {
      mint: mintAddress,
    },
  });

  if (token) {
    console.log(mintAddress, "found");
    return;
  }

  try {
    let nft = await metaplex.nfts().load({ metadata });
    let nftObject: NFTObject = {
      mint: nft.mint.address.toString(),
      name: nft.json?.name!,
      symbol: nft.json?.symbol!,
      price: Math.floor(Math.random() * 50),
      image: nft.json?.image!,
      thumbnail: nft.json?.image!,
      description: nft.json?.description!,
      attributes: nft.json?.attributes!,
    };
    let image = await fetch(nftObject.thumbnail as string);
    let imageData = Buffer.from(await image.arrayBuffer());
    let thumbnailBuffer = await sharp(imageData).resize(500, 500).toBuffer();

    const params = {
      Bucket: "test.nftmarketplace.swastikmishra.me", // pass your bucket name
      Key: `${nftObject.mint}.png`,
      Body: thumbnailBuffer,
      ACL: "public-read",
      ContentType: "image/png",
    };
    let data = await s3.send(new PutObjectCommand(params));
    nftObject.thumbnail = `https://s3.ap-southeast-1.amazonaws.com/test.nftmarketplace.swastikmishra.me/${nftObject.mint}.png`;

    const newNft = await prisma.nFT.create({
      data: nftObject,
    });

    console.log(newNft);
  } catch (e) {
    console.error("Failed to sync", mintAddress);
  }
});

for (let nftIndex = 0; nftIndex < nfts.length; nftIndex++) {
  let metadata = nfts[nftIndex] as Metadata;
}
