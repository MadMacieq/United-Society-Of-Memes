import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner, signerIdentity, sol } from '@metaplex-foundation/umi';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { mplHybrid } from '@metaplex-foundation/mpl-hybrid'


(async () => {
  // Establish a connection to the Solana Devnet
  const connection = new Connection(clusterApiUrl('devnet'));

  // Create a Umi instance
  const umi = createUmi(connection).use(mplHybrid());

  // Generate a new keypair for the NFT creator
  const creator = generateSigner(umi);
  umi.use(signerIdentity(creator));

  // Airdrop SOL to the creator's wallet for transaction fees
  await umi.rpc.airdrop(creator.publicKey, sol(1));

  // Define the metadata for the NFT
  const metadataUri = 'https://example.com/my-nft.json'; // Replace with your metadata URI

  // // Create the NFT
  // const nft = await createNft(umi, {
  //   name: 'My NFT',
  //   uri: metadataUri,
  //   sellerFeeBasisPoints: percentAmount(5), // 5% royalty
  // }).sendAndConfirm(umi);
  //
  // console.log('NFT created with address:', nft.mint.publicKey.toBase58());
})();
