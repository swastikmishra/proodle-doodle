import { NFT, NFTStatus, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getNFTs = async (from: number, offset: number) => {
  return await prisma.nFT.findMany({
    skip: from,
    take: offset,
    orderBy: [{ id: "desc" }, { status: "asc" }],
    select: {
      id: true,
      mint: true,
      name: true,
      symbol: true,
      price: true,
      chain: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      thumbnail: true,
      description: true,
    },
  });
};

export const getNFT = async (nftId: number): Promise<NFT | null> => {
  return await prisma.nFT.findUnique({
    where: {
      id: +nftId,
    },
  });
};

export const updateNFTStatus = async (
  nftId: number,
  status: NFTStatus
): Promise<NFT | null> => {
  return await prisma.nFT.update({
    where: {
      id: nftId,
    },
    data: {
      status: status,
    },
  });
};
