"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenMintAddressSync = exports.getMintAddressSync = exports.getGuardSync = exports.getPayerATASync = exports.getMysteryBoxSync = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const constants_1 = require("./constants");
const getMysteryBoxSync = (programId, mysteryBoxName) => {
    const [mysteryBox] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('mystery_box'), Buffer.from(mysteryBoxName)], programId);
    return mysteryBox;
};
exports.getMysteryBoxSync = getMysteryBoxSync;
const getPayerATASync = (address, Mint) => {
    const [payerATA] = web3_js_1.PublicKey.findProgramAddressSync([address.toBytes(), spl_token_1.TOKEN_2022_PROGRAM_ID.toBytes(), Mint.toBytes()], constants_1.ATA_PROGRAM_ID);
    return payerATA;
};
exports.getPayerATASync = getPayerATASync;
const getGuardSync = (programId, groupName, mysteryBox) => {
    const [guard] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('guard'), Buffer.from(groupName), mysteryBox.toBuffer()], programId);
    return guard;
};
exports.getGuardSync = getGuardSync;
const getMintAddressSync = (programId, nft) => {
    const [mint] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('mint'), Buffer.from(nft)], programId);
    return mint;
};
exports.getMintAddressSync = getMintAddressSync;
const getTokenMintAddressSync = (programId, tokenSymbol) => {
    const [mint] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from('token_mint'), Buffer.from(tokenSymbol)], programId);
    return mint;
};
exports.getTokenMintAddressSync = getTokenMintAddressSync;
