import * as anchor from "@coral-xyz/anchor";
import Spl404Manager from '../spl404Manager'
import {getMintAddressSync} from "../utils/address";

async function main() {
    const provider = anchor.AnchorProvider.env()
    anchor.setProvider(provider)

    const wallet = provider.wallet as anchor.Wallet

    console.log(wallet.publicKey.toString())

    // Load the program
    const spl404Manager = new Spl404Manager(provider.connection, wallet)

    console.log(spl404Manager.program.programId)
    console.log(spl404Manager.provider.publicKey.toString())

    const nft = await spl404Manager.mintNft({
        mysteryBoxName: 'Test',
        guardName: 'Test Guard 1',
        name: 'Triad 3',
        uri: 'https://arweave.net/bqsmiiExtC1g2RwakVPVI9blehWca39yaY8GFRscfDk',
        userWallet: wallet.publicKey.toString(),
        tresuaryAccount: wallet.publicKey
    })

    console.log('Mint NFT TX:', nft)

    const Mint = getMintAddressSync(spl404Manager.program.programId, 'Triad 3')

    console.log('NFT address: ', Mint.toString())
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
