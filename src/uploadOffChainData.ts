import {createGenericFile, createSignerFromKeypair, signerIdentity} from '@metaplex-foundation/umi';
import {createUmi} from '@metaplex-foundation/umi-bundle-defaults';
import {irysUploader} from '@metaplex-foundation/umi-uploader-irys';
import fs from 'fs';
import path from 'path';
import {homedir} from "node:os";
import {mplCore} from "@metaplex-foundation/mpl-core";


(async () => {
  // Initialize Umi with the desired RPC endpoint
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplCore())
    .use(
      // umi.use(nftStorageUploader({ token: 'YOUR_API_TOKEN' }))
      irysUploader({
        // mainnet address: "https://node1.irys.xyz"
        // devnet address: "https://devnet.irys.xyz"
        address: 'https://devnet.irys.xyz',
      })
    )

  // Load signer from file
  const secretKeyString = fs.readFileSync(path.join(homedir(), '.config/solana/id.json'), 'utf8')
  const secretKeyArray = JSON.parse(secretKeyString);
  let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKeyArray));
  const signer = createSignerFromKeypair(umi, keypair);

  console.log(signer.publicKey)

  // Tell Umi to use the new signer.
  umi.use(signerIdentity(signer))

  // Read the image file to be used for the collection
  const imagePath = path.resolve(__dirname, '..', 'assets', 'COLLECTION_IMAGE.JPG');
  const imageBuffer = fs.readFileSync(imagePath);
  const imageFile = createGenericFile(imageBuffer, 'COLLECTION_IMAGE.JPG', {
    tags: [{name: 'Content-Type', value: 'image/jpeg'}],
  });

  // Upload the image to Arweave using the Irys uploader
  const [imageUri] = await umi.uploader.upload([imageFile]);

  console.log("Image URI:", imageUri)

  // Define the metadata for the collection according to doc: https://developers.metaplex.com/token-metadata/token-standard#the-non-fungible-standard
  const metadata = {
    name: 'My Collection #1',
    description: 'This is my NFT collection.',
    image: imageUri,
    properties: {
      files: [
        {
          uri: imageUri,
          type: 'image/jpeg',
        },
      ],
      category: 'image',
    },
  };

  // Upload the metadata JSON to Arweave
  const metadataUri = await umi.uploader.uploadJson(metadata);

  console.log("Metadata URI:", metadataUri)
})();
