import * as anchor from "@coral-xyz/anchor";
import Spl404Manager from '../spl404Manager'
import {PublicKey} from "@solana/web3.js";
import BN from "bn.js";

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

  const amount = 100

  const transfer = await spl404Manager.transferToken(
    {
      mysteryBoxName: 'Test',
      amount: new BN(amount * 10 ** 6),
      mint: mystery.tokenMint,
      to: wallet.publicKey
    }
  )

  console.log('Transfer Token:', transfer)
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
