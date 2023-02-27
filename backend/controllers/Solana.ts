import { keypairIdentity, Metaplex, Nft } from "@metaplex-foundation/js";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

const FILE_WALLET_BUFFER = [
  230, 5, 29, 84, 34, 106, 246, 161, 79, 124, 179, 48, 65, 229, 140, 16, 26, 91,
  77, 61, 92, 144, 38, 56, 144, 37, 229, 14, 17, 178, 233, 131, 199, 14, 25, 48,
  2, 23, 200, 32, 224, 189, 57, 196, 218, 154, 1, 18, 227, 205, 235, 72, 92, 1,
  68, 238, 150, 146, 83, 165, 238, 78, 5, 229,
];

export const SolanaTransferNFT = async (
  mint: string,
  fromWallet: string,
  toWallet: string
) => {
  const connection = new Connection(process.env.SOLANA_CLUSTER_RPC!);
  const metaplex = new Metaplex(connection);
  const keypair = Keypair.fromSecretKey(Buffer.from(FILE_WALLET_BUFFER));
  metaplex.use(keypairIdentity(keypair));

  const sourceWallet: PublicKey = new PublicKey(fromWallet);
  const destinationWallet: PublicKey = new PublicKey(toWallet);

  const mintAddress: PublicKey = new PublicKey(mint);

  const nft: Nft = (await metaplex.nfts().findByMint({ mintAddress })) as Nft;

  try{
    return await metaplex.nfts().transfer({
      nftOrSft: nft,
      authority: keypair,
      fromOwner: sourceWallet,
      toOwner: destinationWallet,
    });
  }catch(err){
    return null;
  }
};
