import * as anchor from "@coral-xyz/anchor";
import Spl404Manager from '../spl404Manager'
import {getPayerATASync} from "../utils/address";

async function main() {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const wallet = provider.wallet as anchor.Wallet

  console.log(wallet.publicKey.toString())

  // Load the program
  const spl404Manager = new Spl404Manager(provider.connection, wallet)

  console.log(spl404Manager.program.programId)
  console.log(spl404Manager.provider.publicKey.toString())

  const mystery = await spl404Manager.getMysteryBox('Test')

  console.log(mystery.name)
  console.log(mystery.tokenMint)

  const PayerAta = getPayerATASync(mystery.address, mystery.tokenMint)
  console.log('PayerAta: ', PayerAta)

  const token = await spl404Manager.mintToken(
    {
      mysteryBoxName: mystery.name,
      mint: mystery.tokenMint,
    }
  )

  console.log('Mint Token TX:', token)
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
