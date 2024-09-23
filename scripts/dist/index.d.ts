/// <reference types="bn.js" />
import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { Spl404 } from './types/spl_404';
import { BurnToken, CreateToken, MintToken, TransferToken, Swap, CreateMysteryBox, CreateGuard, MintNft, BurnGuard, RpcOptions, BurnNFT } from './utils/types';
export default class TriadSpl404 {
    provider: AnchorProvider;
    program: Program<Spl404>;
    constructor(connection: Connection, wallet: Wallet);
    getMysteryBox: (mysteryBoxName: string) => Promise<{
        address: PublicKey;
        initTs: number;
        tokenSupply: number;
        tokenPerNft: number;
        maxFee: number;
        tokenFee: number;
        name: string;
        authority: PublicKey;
        nftSymbol: string;
        nftSupply: number;
        nftMinteds: number;
        tokenMint: PublicKey;
        tokenAccount: PublicKey;
        tokenSymbol: string;
        decimals: number;
        bump: number;
        tresuaryAccount: PublicKey;
    }>;
    getGuards: () => Promise<import("@coral-xyz/anchor").ProgramAccount<{
        initTs: BN;
        endTs: BN;
        name: string;
        id: number;
        supply: BN;
        minted: BN;
        price: BN;
        mysteryBox: PublicKey;
        walletStorage: PublicKey;
    }>[]>;
    createMysteryBox: (mysteryBox: CreateMysteryBox, options?: RpcOptions) => Promise<string>;
    createGuard: (guard: CreateGuard, options?: RpcOptions) => Promise<string>;
    burnGuard: (guard: BurnGuard, options?: RpcOptions) => Promise<string>;
    mintNft: (nft: MintNft, options?: RpcOptions) => Promise<string>;
    createToken: (token: CreateToken, options?: RpcOptions) => Promise<string>;
    mintToken: (token: MintToken, options?: RpcOptions) => Promise<string>;
    burnToken: (token: BurnToken, options?: RpcOptions) => Promise<string>;
    burnNFT: (nft: BurnNFT, options?: RpcOptions) => Promise<string>;
    transferToken: (token: TransferToken, options?: RpcOptions) => Promise<string>;
    swapNft: (swap: Swap, options?: RpcOptions) => Promise<string>;
    swapToken: (swap: Swap, options?: RpcOptions) => Promise<string>;
}
