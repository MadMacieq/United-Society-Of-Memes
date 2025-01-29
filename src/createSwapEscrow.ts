import { join} from 'path';
import fs from 'fs';
import {homedir} from "node:os";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { publicKey, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi'
import { mplHybrid, MPL_HYBRID_PROGRAM_ID, initEscrowV1 } from '@metaplex-foundation/mpl-hybrid'
import { string, base58, publicKey as publicKeySerializer } from '@metaplex-foundation/umi/serializers'
import {mplTokenMetadata} from "@metaplex-foundation/mpl-token-metadata";
import { transfer } from "@metaplex-foundation/mpl-core";



// https://developers.metaplex.com/mpl-hybrid/guides/create-your-first-hybrid-collection
(async () => {
  // Initialize Umi with the desired RPC endpoint
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplHybrid())
    .use(mplTokenMetadata())

  // Load signer from file
  const secretKeyString = fs.readFileSync(join(homedir(), '.config/solana/id.json'), 'utf8')
  const secretKeyArray = JSON.parse(secretKeyString);
  let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKeyArray));
  const signer = createSignerFromKeypair(umi, keypair);

  console.log(signer.publicKey)

  // Tell Umi to use the new signer.
  umi.use(signerIdentity(signer))

  // Escrow Settings - Change these to your needs
  const name = "MPL-404 Hybrid Escrow"; // The name of the escrow contract
  const uri = "https://arweave.devnet.irys.xyz/7HCC3kxdJQmh5FiSMVJqQ51ZkwSW8KVG3Gs5AaL1YfyM"; // The base URI of the NFT collection. This should follow the deterministic metadata structure.
  const max = 4; // These define the range of the deterministic URIs for the collection's metadata.
  const min = 0;
  const path = 0; // Choose between two paths: 0 to update the NFT metadata on swap, or 1 to keep the metadata unchanged after a swap.

  // Escrow Accounts - Change these to your needs
  const collection = publicKey('AsF8FL5SHk2LGnr1EerZyAQZTS5oAnFdchniGikZECpe');
  const token = publicKey('9j5Dm6CGw7ynNDUBvKBnVbuPzE8Kdp5Gnm1Ltan3orKs');
  const feeLocation = signer.publicKey; // The address where any fees from the swaps will be sent.
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
  ]); // The derived escrow account, which is responsible for holding the NFTs and tokens during the swap process.

  console.log('Escrow address:', escrow);

  // Token Swap Settings - Change these to your needs
  const tokenDecimals = 9;
  const amount = addZeros(100, tokenDecimals);
  const feeAmount = addZeros(1, tokenDecimals);
  const solFeeAmount = addZeros(0, 9);

  const initEscrowTx = await initEscrowV1(umi, {
    name,
    uri,
    max,
    min,
    path,
    escrow,
    collection,
    token,
    feeLocation,
    amount,
    feeAmount,
    solFeeAmount,
  }).sendAndConfirm(umi);

  const signature = base58.deserialize(initEscrowTx.signature)[0]
  console.log(`Escrow created! https://explorer.solana.com/tx/${signature}?cluster=devnet`)

  // Transfer Asset to escrow
  // const asset = publicKey("7zyaJoa1itHBxkxMK3n1UkvYHNncFLwr8hqE4cjRpd8p");
  // await transfer(umi, {
  //   asset,
  //   collection,
  //   newOwner: escrow[0],
  // }).sendAndConfirm(umi);

})();

// Function that adds zeros to a number, needed for adding the correct amount of decimals
function addZeros(num: number, numZeros: number): number {
  return num * Math.pow(10, numZeros)
}
