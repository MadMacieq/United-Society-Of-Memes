import {createSignerFromKeypair, generateSigner, signerIdentity} from '@metaplex-foundation/umi';
import {createUmi} from '@metaplex-foundation/umi-bundle-defaults';
import fs from 'fs';
import path from 'path';
import {homedir} from "node:os";
import {
  addCollectionPlugin,
  fetchCollection,
  mplCore,
  updateCollection,
  updateCollectionPlugin
} from '@metaplex-foundation/mpl-core'
import {publicKey} from '@metaplex-foundation/umi'
import {ruleSet} from "@metaplex-foundation/mpl-core/dist/src/plugins/types";


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

  const collectionAddress = publicKey('DeJBrFhUeVfiVLiH9cay5bMsdkgCmqq2ymeALDLzrPSK')

  await updateCollection(umi, {
    collection: collectionAddress,
    name: 'My Collection #2',
    uri: 'https://arweave.net/M92UyCTGVkztYgK523qs11qSqHujUbNk5VhbzRExxw6',
  }).sendAndConfirm(umi)

  // await addCollectionPlugin(umi, {
  //   collection: collectionAddress,
  //   plugin: {
  //     type: 'Royalties',
  //     basisPoints: 400,
  //     creators: [{ address: signer.publicKey, percentage: 100 }],
  //     ruleSet: ruleSet('None'),
  //   },
  // }).sendAndConfirm(umi);

  await updateCollectionPlugin(umi, {
    collection: collectionAddress,
    plugin: {
      type: 'Royalties',
      basisPoints: 400,
      creators: [{ address: signer.publicKey, percentage: 100 }],
      ruleSet: ruleSet('None'),
    },
  }).sendAndConfirm(umi)

  const collection = await fetchCollection(umi, collectionAddress)

  console.log(collection)
})();
