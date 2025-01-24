import {createSignerFromKeypair, generateSigner, signerIdentity} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import fs from 'fs';
import path from 'path';
import {homedir} from "node:os";
import {create, fetchCollection, mplCore} from '@metaplex-foundation/mpl-core'
import {publicKey} from '@metaplex-foundation/umi'


(async () => {
  // Initialize Umi with the desired RPC endpoint
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplCore())

  // Load signer from file
  const secretKeyString = fs.readFileSync(path.join(homedir(), '.config/solana/id.json'), 'utf8')
  const secretKeyArray = JSON.parse(secretKeyString);
  let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKeyArray));
  const signer = createSignerFromKeypair(umi, keypair);

  console.log(signer.publicKey)

  // Tell Umi to use the new signer.
  umi.use(signerIdentity(signer))

  const collectionAddress = publicKey('AsF8FL5SHk2LGnr1EerZyAQZTS5oAnFdchniGikZECpe')
  const collection = await fetchCollection(umi, collectionAddress)

  // generate assetSigner and then create the asset.
  const assetSigner = generateSigner(umi)

  // Create the NFT
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: 'NFT #5',
    uri: 'https://arweave.devnet.irys.xyz/BvQ8pVAJykonxcm8W99ikFvTdKtnurujeC5PvxNK3Eh1',
  }).sendAndConfirm(umi)

  console.log('NFT address:', assetSigner.publicKey);
})();
