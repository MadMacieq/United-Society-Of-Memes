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

    const guard = await spl404Manager.createGuard({
        name: 'Test Guard 1',
        id: 1,
        supply: 1000,
        price: 1000,
        initTs: 1727114534, // 2024.09.23
        endTs: 1758650534, // 2025.09.23
        mysteryBoxName: 'Test'
    })

    console.log('Guard TX:', guard)

    const guards = await spl404Manager.getGuards()

    console.log('Guards: ', guards)
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
