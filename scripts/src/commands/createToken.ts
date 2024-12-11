import * as anchor from "@coral-xyz/anchor";
import Spl404Manager from '../spl404Manager'
import {Keypair} from "@solana/web3.js";

async function main() {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const wallet = provider.wallet as anchor.Wallet

  console.log(wallet.publicKey.toString())

  // Load the program
  const spl404Manager = new Spl404Manager(provider.connection, wallet)

  console.log(spl404Manager.program.programId)
  console.log(spl404Manager.provider.publicKey.toString())

  const mint = Keypair.generate()

  console.log('Mint address:', mint.publicKey.toString())

  const token = await spl404Manager.createToken(
    {
      mysteryBoxName: 'Test',
      symbol: 'tTRIAD',
      uri: 'https://shdw-drive.genesysgo.net/9ZgbDbP9wL1oPegdNj66TH6tnazEMFcMnREJdKsKEMwx/triad.json',
      mint
    }
  )

  console.log('Create Token:', token)
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
