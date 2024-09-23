"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const idl_spl_404_json_1 = __importDefault(require("./types/idl_spl_404.json"));
const address_1 = require("./utils/address");
class TriadSpl404 {
    constructor(connection, wallet) {
        this.getMysteryBox = (mysteryBoxName) => __awaiter(this, void 0, void 0, function* () {
            const MysteryBox = (0, address_1.getMysteryBoxSync)(this.program.programId, mysteryBoxName);
            const data = yield this.program.account.mysteryBox.fetch(MysteryBox);
            return Object.assign(Object.assign({}, data), { address: MysteryBox, initTs: data.initTs.toNumber(), tokenSupply: data.tokenSupply.toNumber(), tokenPerNft: data.tokenPerNft.toNumber(), maxFee: data.maxFee.toNumber(), tokenFee: data.tokenFee / 100 });
        });
        this.getGuards = () => __awaiter(this, void 0, void 0, function* () {
            return this.program.account.guard.all();
        });
        this.createMysteryBox = (mysteryBox, options) => __awaiter(this, void 0, void 0, function* () {
            const method = this.program.methods
                .createMysteryBox({
                maxFee: new anchor_1.BN(mysteryBox.maxFee || mysteryBox.nftSupply * mysteryBox.tokenPerNft),
                name: mysteryBox.name,
                nftSymbol: mysteryBox.nftSymbol,
                tokenFee: mysteryBox.tokenFee,
                tokenPerNft: new anchor_1.BN(mysteryBox.tokenPerNft),
                tokenSymbol: mysteryBox.tokenSymbol,
                nftSupply: mysteryBox.nftSupply,
                tresuaryAccount: new web3_js_1.PublicKey(mysteryBox.tresuaryAccount),
                decimals: mysteryBox.decimals
            })
                .accounts({
                signer: this.provider.wallet.publicKey
            });
            if (options === null || options === void 0 ? void 0 : options.microLamports) {
                method.postInstructions([
                    web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                        microLamports: options.microLamports
                    })
                ]);
            }
            return method.rpc({ skipPreflight: options === null || options === void 0 ? void 0 : options.skipPreflight });
        });
        this.createGuard = (guard, options) => __awaiter(this, void 0, void 0, function* () {
            const MysteryBox = (0, address_1.getMysteryBoxSync)(this.program.programId, guard.mysteryBoxName);
            const method = this.program.methods
                .createGuard({
                name: guard.name,
                id: guard.id,
                supply: new anchor_1.BN(guard.supply),
                price: new anchor_1.BN(guard.price),
                initTs: new anchor_1.BN(guard.initTs),
                endTs: new anchor_1.BN(guard.endTs)
            })
                .accounts({ mysteryBox: MysteryBox });
            if (options === null || options === void 0 ? void 0 : options.microLamports) {
                method.postInstructions([
                    web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                        microLamports: options.microLamports
                    })
                ]);
            }
            return method.rpc({ skipPreflight: options === null || options === void 0 ? void 0 : options.skipPreflight });
        });
        this.burnGuard = (guard, options) => __awaiter(this, void 0, void 0, function* () {
            const MysteryBox = (0, address_1.getMysteryBoxSync)(this.program.programId, guard.mysteryBoxName);
            const method = this.program.methods
                .burnGuard(guard.name)
                .accounts({ mysteryBox: MysteryBox });
            if (options === null || options === void 0 ? void 0 : options.microLamports) {
                method.postInstructions([
                    web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                        microLamports: options.microLamports
                    })
                ]);
            }
            return method.rpc({ skipPreflight: options === null || options === void 0 ? void 0 : options.skipPreflight });
        });
        this.mintNft = (nft, options) => __awaiter(this, void 0, void 0, function* () {
            const wallet = new web3_js_1.PublicKey(nft.userWallet);
            const MysteryBox = (0, address_1.getMysteryBoxSync)(this.program.programId, nft.mysteryBoxName);
            const Guard = (0, address_1.getGuardSync)(this.program.programId, nft.guardName, MysteryBox);
            const Mint = (0, address_1.getMintAddressSync)(this.program.programId, nft.name);
            const PayerATA = (0, address_1.getPayerATASync)(wallet, Mint);
            const method = this.program.methods
                .mintNft({
                name: nft.name,
                uri: nft.uri
            })
                .accounts({
                signer: wallet,
                guard: Guard,
                mysteryBox: MysteryBox,
                payerAta: PayerATA,
                treasuryAccount: nft.tresuaryAccount
            });
            if (options === null || options === void 0 ? void 0 : options.microLamports) {
                method.postInstructions([
                    web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                        microLamports: options.microLamports
                    })
                ]);
            }
            return method.rpc({ skipPreflight: options === null || options === void 0 ? void 0 : options.skipPreflight });
        });
        this.createToken = (token, options) => __awaiter(this, void 0, void 0, function* () {
            const MysteryBox = (0, address_1.getMysteryBoxSync)(this.program.programId, token.mysteryBoxName);
            const method = this.program.methods
                .createToken({
                uri: token.uri
            })
                .accounts({
                signer: this.provider.wallet.publicKey,
                mint: token.mint.publicKey,
                mysteryBox: MysteryBox
            })
                .signers([token.mint]);
            if (options === null || options === void 0 ? void 0 : options.microLamports) {
                method.postInstructions([
                    web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                        microLamports: options.microLamports
                    })
                ]);
            }
            return method.rpc({ skipPreflight: options === null || options === void 0 ? void 0 : options.skipPreflight });
        });
        this.mintToken = (token, options) => __awaiter(this, void 0, void 0, function* () {
            const MysteryBox = (0, address_1.getMysteryBoxSync)(this.program.programId, token.mysteryBoxName);
            const PayerAta = (0, address_1.getPayerATASync)(MysteryBox, token.mint);
            const method = this.program.methods
                .mintToken({
                mysteryBoxName: token.mysteryBoxName
            })
                .accounts({
                signer: this.provider.wallet.publicKey,
                mint: token.mint,
                payerAta: PayerAta
            });
            if (options === null || options === void 0 ? void 0 : options.microLamports) {
                method.postInstructions([
                    web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                        microLamports: options.microLamports
                    })
                ]);
            }
            return method.rpc({ skipPreflight: options === null || options === void 0 ? void 0 : options.skipPreflight });
        });
        this.burnToken = (token, options) => __awaiter(this, void 0, void 0, function* () {
            const MysteryBox = (0, address_1.getMysteryBoxSync)(this.program.programId, token.mysteryBoxName);
            const PayerAta = (0, address_1.getPayerATASync)(MysteryBox, token.mint);
            const method = this.program.methods
                .burnToken({
                amount: token.amount
            })
                .accounts({
                payerAta: PayerAta,
                mysteryBox: MysteryBox,
                mint: token.mint
            });
            if (options === null || options === void 0 ? void 0 : options.microLamports) {
                method.postInstructions([
                    web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                        microLamports: options.microLamports
                    })
                ]);
            }
            return method.rpc({ skipPreflight: options === null || options === void 0 ? void 0 : options.skipPreflight });
        });
        this.burnNFT = (nft, options) => __awaiter(this, void 0, void 0, function* () {
            const MysteryBox = (0, address_1.getMysteryBoxSync)(this.program.programId, nft.mysteryBoxName);
            const PayerAta = (0, address_1.getPayerATASync)(MysteryBox, nft.mint);
            const method = this.program.methods.burnNft().accounts({
                payerAta: PayerAta,
                mysteryBox: MysteryBox,
                mint: nft.mint
            });
            if (options === null || options === void 0 ? void 0 : options.microLamports) {
                method.postInstructions([
                    web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                        microLamports: options.microLamports
                    })
                ]);
            }
            return method.rpc({ skipPreflight: options === null || options === void 0 ? void 0 : options.skipPreflight });
        });
        this.transferToken = (token, options) => __awaiter(this, void 0, void 0, function* () {
            const MysteryBox = (0, address_1.getMysteryBoxSync)(this.program.programId, token.mysteryBoxName);
            const PayerAta = (0, address_1.getPayerATASync)(MysteryBox, token.mint);
            const ToAta = (0, address_1.getPayerATASync)(token.to, token.mint);
            const method = this.program.methods
                .transferToken({
                amount: token.amount
            })
                .accounts({
                payerAta: PayerAta,
                mint: token.mint,
                mysteryBox: MysteryBox,
                toAta: ToAta
            });
            if (options === null || options === void 0 ? void 0 : options.microLamports) {
                method.postInstructions([
                    web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                        microLamports: options.microLamports
                    })
                ]);
            }
            return method.rpc({ skipPreflight: options === null || options === void 0 ? void 0 : options.skipPreflight });
        });
        this.swapNft = (swap, options) => __awaiter(this, void 0, void 0, function* () {
            const MysteryBox = (0, address_1.getMysteryBoxSync)(this.program.programId, swap.mysteryBoxName);
            const TokenToATA = (0, address_1.getPayerATASync)(swap.wallet, swap.tokenMint);
            const TokenFromATA = (0, address_1.getPayerATASync)(MysteryBox, swap.tokenMint);
            const NftToATA = (0, address_1.getPayerATASync)(MysteryBox, swap.nftMint);
            const NftFromATA = (0, address_1.getPayerATASync)(swap.wallet, swap.nftMint);
            const method = this.program.methods
                .swapNft({
                nftName: swap.nftName
            })
                .accounts({
                mysteryBox: MysteryBox,
                tokenFromAta: TokenFromATA,
                tokenMint: swap.tokenMint,
                tokenToAta: TokenToATA,
                nftFromAta: NftFromATA,
                nftMint: swap.nftMint,
                nftToAta: NftToATA,
                signer: swap.wallet
            });
            if (options === null || options === void 0 ? void 0 : options.microLamports) {
                method.postInstructions([
                    web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                        microLamports: options.microLamports
                    })
                ]);
            }
            return method.rpc({ skipPreflight: options === null || options === void 0 ? void 0 : options.skipPreflight });
        });
        this.swapToken = (swap, options) => __awaiter(this, void 0, void 0, function* () {
            const MysteryBox = (0, address_1.getMysteryBoxSync)(this.program.programId, swap.mysteryBoxName);
            const TokenToATA = (0, address_1.getPayerATASync)(MysteryBox, swap.tokenMint);
            const TokenFromATA = (0, address_1.getPayerATASync)(swap.wallet, swap.tokenMint);
            const NftToATA = (0, address_1.getPayerATASync)(swap.wallet, swap.nftMint);
            const NftFromATA = (0, address_1.getPayerATASync)(MysteryBox, swap.nftMint);
            const method = this.program.methods.swapToken().accounts({
                mysteryBox: MysteryBox,
                tokenFromAta: TokenFromATA,
                tokenMint: swap.tokenMint,
                tokenToAta: TokenToATA,
                nftFromAta: NftFromATA,
                nftMint: swap.nftMint,
                nftToAta: NftToATA,
                signer: swap.wallet
            });
            if (options === null || options === void 0 ? void 0 : options.microLamports) {
                method.postInstructions([
                    web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
                        microLamports: options.microLamports
                    })
                ]);
            }
            return method.rpc({ skipPreflight: options === null || options === void 0 ? void 0 : options.skipPreflight });
        });
        this.provider = new anchor_1.AnchorProvider(connection, wallet, anchor_1.AnchorProvider.defaultOptions());
        this.program = new anchor_1.Program(idl_spl_404_json_1.default, this.provider);
    }
}
exports.default = TriadSpl404;
