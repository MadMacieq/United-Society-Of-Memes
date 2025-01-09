import { createGenericFile} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import fs from 'fs';
import path from 'path';


(async () => {
  // Initialize Umi with the desired RPC endpoint
  let umi = createUmi('https://api.devnet.solana.com')

  // Select the Irys uploader (uploads to Arweave)
  umi.use(irysUploader())

  // Read the image file to be used for the collection
  const imagePath = path.resolve(__dirname, '..', 'assets', 'COLLECTION_IMAGE.JPG');
  const imageBuffer = fs.readFileSync(imagePath);
  const imageFile = createGenericFile(imageBuffer, 'COLLECTION_IMAGE.JPG', {
    tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
  });

  // Upload the image to Arweave using the Irys uploader
  const [imageUri] = await umi.uploader.upload([imageFile]);

  console.log(imageUri)

  // Define the metadata for the collection
  // const metadata = {
  //   name: 'My Collection',
  //   description: 'This is my NFT collection.',
  //   image: imageUri,
  //   properties: {
  //     files: [
  //       {
  //         uri: imageUri,
  //         type: 'image/jpeg',
  //       },
  //     ],
  //     category: 'image',
  //   },
  // };

  // // Upload the metadata JSON to Arweave
  // const metadataUri = await umi.uploader.uploadJson(metadata);
  //
  // // Generate a new keypair for the collection asset
  // const collectionSigner = generateSigner(umi);
  //
  // // Create the collection on-chain
  // await createCollection(umi, {
  //   collection: collectionSigner,
  //   name: metadata.name,
  //   uri: metadataUri,
  // }).sendAndConfirm(umi);
  //
  // console.log('Collection created with address:', collectionSigner.publicKey.toBase58());
})();
