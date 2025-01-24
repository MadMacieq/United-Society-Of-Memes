import {createSignerFromKeypair, generateSigner, publicKey, signerIdentity} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import fs from 'fs';
import path from 'path';
import {homedir} from "node:os";
import {
  createFungible,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  findAssociatedTokenPda,
  mplToolbox,
  mintTokensTo,
  createTokenIfMissing,
  getSplAssociatedTokenProgramId,
} from '@metaplex-foundation/mpl-toolbox'
import {percentAmount} from '@metaplex-foundation/umi'


(async () => {
  // Initialize Umi with the desired RPC endpoint
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplTokenMetadata())
    .use(mplToolbox())

  // Load signer from file
  const secretKeyString = fs.readFileSync(path.join(homedir(), '.config/solana/id.json'), 'utf8')
  const secretKeyArray = JSON.parse(secretKeyString);
  let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKeyArray));
  const signer = createSignerFromKeypair(umi, keypair);

  console.log(signer.publicKey)

  // Tell Umi to use the new signer.
  umi.use(signerIdentity(signer))

  // generate assetSigner and then create the asset.
  const mintSigner = generateSigner(umi)

  // Create Token
  await createFungible(umi, {
    mint: mintSigner,
    name: 'The Kitten Coin',
    uri: 'https://arweave.devnet.irys.xyz/9bi34FuG4rEF26AQdz2obN4ErwpJPcok6ePZpPybbjkx',
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 9,
  }).sendAndConfirm(umi)

  console.log('Token address:', mintSigner.publicKey);

  const tokenAddress = mintSigner.publicKey
  // const tokenAddress = publicKey('9j5Dm6CGw7ynNDUBvKBnVbuPzE8Kdp5Gnm1Ltan3orKs')

  await createTokenIfMissing(umi, {
    mint: tokenAddress,
    owner: umi.identity.publicKey,
    ataProgram: getSplAssociatedTokenProgramId(umi),
  }).sendAndConfirm(umi)

  await mintTokensTo(umi, {
    mint: tokenAddress,
    token: findAssociatedTokenPda(umi, {
      mint: tokenAddress,
      owner: umi.identity.publicKey,
    }),
    amount: BigInt(1000000000000),
  }).sendAndConfirm(umi)
})();
