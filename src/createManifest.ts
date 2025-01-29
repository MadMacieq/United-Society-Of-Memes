import {createGenericFile, createSignerFromKeypair, signerIdentity} from '@metaplex-foundation/umi';
import {createUmi} from '@metaplex-foundation/umi-bundle-defaults';
import {irysUploader} from '@metaplex-foundation/umi-uploader-irys';
import fs from 'fs';
import path from 'path';
import {homedir} from "node:os";
import {mplCore} from "@metaplex-foundation/mpl-core";

interface ManifestPath {
  id: string;
}

interface Manifest {
  manifest: string;
  version: string;
  index: {
    path: string;
  };
  paths: Record<string, ManifestPath>;
}


(async () => {
  // Initialize Umi with the desired RPC endpoint
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplCore())
    .use(
      // umi.use(nftStorageUploader({ token: 'YOUR_API_TOKEN' }))
      irysUploader({
        // mainnet address: "https://node1.irys.xyz"
        // devnet address: "https://devnet.irys.xyz"
        address: 'https://arweave.devnet.irys.xyz',
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

  const metadataDir = path.resolve(__dirname, '../metadata');
  const metadataFiles = fs.readdirSync(metadataDir).filter(file => file.endsWith('.json'));

  const metadataList = metadataFiles.map(fileName => {
    const filePath = path.join(metadataDir, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return {
      fileName,
      content: JSON.parse(fileContent),
    };
  });

  console.log(metadataList)

  const uploadedFiles = await Promise.all(
    metadataList.map(async ({ fileName, content }) => {
      const uri = await umi.uploader.uploadJson(content);
      const transactionId = new URL(uri).pathname.split('/')[1];
      return { fileName, transactionId };
    })
  );

  console.log(uploadedFiles)

  const manifest = {
    manifest: 'arweave/paths',
    version: '0.1.0',
    index: {
      path: '0.json',
    },
    paths: uploadedFiles.reduce((acc, { fileName, transactionId }) => {
      acc[fileName] = { id: transactionId };
      return acc;
    }, {} as Record<string, ManifestPath>),
  };

  console.log(manifest)

  const manifestJson = JSON.stringify(manifest);

// Create a generic file with the manifest JSON and set the appropriate Content-Type
  const manifestFile = createGenericFile(
    Buffer.from(manifestJson, 'utf-8'),
    'manifest.json',
    {
      tags: [{ name: 'Content-Type', value: 'application/x.arweave-manifest+json' }],
    }
  );

  // Upload the manifest file
  const [manifestUri] = await umi.uploader.upload([manifestFile]);
  const manifestTransactionId = new URL(manifestUri).pathname.split('/')[1];
  console.log(`Manifest uploaded successfully! Access your files at: https://arweave.devnet.irys.xyz/${manifestTransactionId}/0.json`);
})();
