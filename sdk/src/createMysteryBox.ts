import * as anchor from "@coral-xyz/anchor";
import TriadSpl404 from './index'

async function main() {
    const provider = anchor.AnchorProvider.env()
    anchor.setProvider(provider)

    const wallet = provider.wallet as anchor.Wallet

    console.log(wallet.publicKey.toString())

    // Load the program
    const triadSpl404 = new TriadSpl404(provider.connection, wallet)

    console.log(triadSpl404.program.programId)
    console.log(triadSpl404.provider.publicKey.toString())

    // Deploy your program (if not deployed yet)
    console.log('Deploying the program...');

    const mystery = await triadSpl404.createMysteryBox({
        name: 'Triad',
        decimals: 6,
        nftSymbol: 'TRIAD',
        tokenFee: 200,
        tokenPerNft: 10000,
        tokenSymbol: 'tTRIAD',
        maxFee: 10000 * 10 ** 6,
        nftSupply: 1000,
        tresuaryAccount: wallet.publicKey.toString()
    })

    console.log('Mystery:', mystery)
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
