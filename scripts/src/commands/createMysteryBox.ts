import * as anchor from "@coral-xyz/anchor";
import Spl404Manager from '../spl404Manager'

async function main() {
    const provider = anchor.AnchorProvider.env()
    anchor.setProvider(provider)

    const wallet = provider.wallet as anchor.Wallet

    console.log(wallet.publicKey.toString())

    // Load the program
    const spl404Manager = new Spl404Manager(provider.connection, wallet)

    console.log(spl404Manager.program.programId)
    console.log(spl404Manager.provider.publicKey.toString())

    const mystery = await spl404Manager.createMysteryBox({
        name: 'Test',
        decimals: 6,
        nftSymbol: 'TEST',
        tokenFee: 200, // 200 basis points 2%
        tokenPerNft: 10000,
        tokenSymbol: 'tTEST',
        maxFee: 10000 * 10 ** 6, // No max fee
        nftSupply: 1000,
        tresuaryAccount: wallet.publicKey.toString()
    })

    console.log('Mystery TX:', mystery)
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
