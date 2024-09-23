/// <reference types="node" />
import { Connection, Keypair } from '@solana/web3.js';
import TriadSpl404 from './index';
import { Wallet } from '@coral-xyz/anchor';
export default class Test {
    file: Buffer;
    rpc_file: Buffer;
    Keypair: Keypair;
    connection: Connection;
    wallet: Wallet;
    triadSpl404: TriadSpl404;
    mysteryBoxName: string;
    guard: string;
    tokenSymbol: string;
    mint: string;
    logMysteryBox: () => Promise<void>;
    logGuards: () => Promise<void>;
    createMysteryBox: () => Promise<void>;
    createGuard: () => Promise<void>;
    mintNft: () => Promise<void>;
    createToken: () => Promise<void>;
    mintToken: () => Promise<void>;
    transferToken: () => Promise<void>;
    burnToken: () => Promise<void>;
    swapToken: () => Promise<void>;
    getMints: () => Promise<void>;
    burnNft: () => Promise<void>;
}
