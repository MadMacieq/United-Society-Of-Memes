# United-Meme-Society

## Precondition

Install Anchor by [following the steps from the Anchor docs](https://www.anchor-lang.com/docs/installation).

## Devnet faucet

Get devent SOL tokens

    solana airdrop 5

Get devnet [USDC tokens](https://faucet.circle.com/)

## Build contract

    anchor build

## Deploy

Deploy on devnet

    anchor deploy --provider.cluster devnet

## Run SDK scripts

    cd sdk

Install dependencies

    yarn install

Create mystery box 

    anchor run create-mystery-box --provider.cluster devnet
