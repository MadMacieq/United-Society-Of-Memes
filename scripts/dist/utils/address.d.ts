import { PublicKey } from '@solana/web3.js';
export declare const getMysteryBoxSync: (programId: PublicKey, mysteryBoxName: string) => PublicKey;
export declare const getPayerATASync: (address: PublicKey, Mint: PublicKey) => PublicKey;
export declare const getGuardSync: (programId: PublicKey, groupName: string, mysteryBox: PublicKey) => PublicKey;
export declare const getMintAddressSync: (programId: PublicKey, nft: string) => PublicKey;
export declare const getTokenMintAddressSync: (programId: PublicKey, tokenSymbol: string) => PublicKey;
