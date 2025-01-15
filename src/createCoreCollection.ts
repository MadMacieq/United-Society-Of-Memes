import {createSignerFromKeypair, generateSigner, signerIdentity} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import fs from 'fs';
import path from 'path';
import {homedir} from "node:os";
import {createCollection, fetchCollection, mplCore} from '@metaplex-foundation/mpl-core'


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

  const collectionSigner = generateSigner(umi)

  await createCollection(umi, {
    collection: collectionSigner,
    name: 'My Collection #1',
    uri: 'https://arweave.net/M92UyCTGVkztYgK523qs11qSqHujUbNk5VhbzRExxw6',
  }).sendAndConfirm(umi)

  console.log('Collection address:', collectionSigner.publicKey)

  const collection = await fetchCollection(umi, collectionSigner.publicKey)

  console.log(collection)
})();
