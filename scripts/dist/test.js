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
const fs_1 = __importDefault(require("fs"));
const web3_js_1 = require("@solana/web3.js");
const index_1 = __importDefault(require("./index"));
const axios_1 = __importDefault(require("axios"));
const anchor_1 = require("@coral-xyz/anchor");
const spl_token_1 = require("@solana/spl-token");
class Test {
    constructor() {
        this.file = fs_1.default.readFileSync('/Users/dannpl/.config/solana/triad-man.json');
        this.rpc_file = fs_1.default.readFileSync('/Users/dannpl/.config/solana/rpc.txt');
        this.Keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(JSON.parse(this.file.toString())));
        this.connection = new web3_js_1.Connection(this.rpc_file.toString(), 'confirmed');
        this.wallet = new anchor_1.Wallet(this.Keypair);
        this.triadSpl404 = new index_1.default(this.connection, this.wallet);
        this.mysteryBoxName = 'Triad';
        this.guard = 'Guard 1';
        this.tokenSymbol = 'tTRIAD';
        this.mint = 't3DohmswhKk94PPbPYwA6ZKACyY3y5kbcqeQerAJjmV';
        this.logMysteryBox = () => __awaiter(this, void 0, void 0, function* () {
            const mystery = yield this.triadSpl404.getMysteryBox(this.mysteryBoxName);
            console.log(mystery);
        });
        this.logGuards = () => __awaiter(this, void 0, void 0, function* () {
            const guards = yield this.triadSpl404.getGuards();
            console.log(guards);
        });
        this.createMysteryBox = () => __awaiter(this, void 0, void 0, function* () {
            const mystery = yield this.triadSpl404.createMysteryBox({
                name: this.mysteryBoxName,
                decimals: 6,
                nftSymbol: 'TRIAD',
                tokenFee: 200,
                tokenPerNft: 10000,
                tokenSymbol: 'tTRIAD',
                maxFee: 10000 * Math.pow(10, 6),
                nftSupply: 3964,
                tresuaryAccount: this.wallet.publicKey.toString()
            });
            console.log('Mystery:', mystery);
        });
        this.createGuard = () => __awaiter(this, void 0, void 0, function* () {
            const guard = yield this.triadSpl404.createGuard({
                name: this.guard,
                id: 1,
                supply: 3963,
                price: 1000,
                initTs: 1718266580,
                endTs: 1719724775,
                mysteryBoxName: this.mysteryBoxName
            });
            console.log('Guard', guard);
        });
        this.mintNft = () => __awaiter(this, void 0, void 0, function* () {
            const nft = yield this.triadSpl404.mintNft({
                mysteryBoxName: this.mysteryBoxName,
                guardName: this.guard,
                name: 'Triad 2',
                uri: 'https://arweave.net/bqsmiiExtC1g2RwakVPVI9blehWca39yaY8GFRscfDk',
                userWallet: this.wallet.publicKey.toString(),
                tresuaryAccount: this.wallet.publicKey
            });
            console.log('Mint NFT:', nft);
        });
        this.createToken = () => __awaiter(this, void 0, void 0, function* () {
            // const file = fs.readFileSync(
            //   '/Users/dannpl/.config/solana/TRDwq3BN4mP3m9KsuNUWSN6QDff93VKGSwE95Jbr9Ss.json'
            // )
            // const mint = Keypair.fromSecretKey(
            //   new Uint8Array(JSON.parse(file.toString()))
            // )
            const mint = web3_js_1.Keypair.generate();
            this.mint = mint.publicKey.toString();
            console.log('Mint:', mint.publicKey.toString());
            const token = yield this.triadSpl404.createToken({
                mysteryBoxName: this.mysteryBoxName,
                symbol: this.tokenSymbol,
                uri: 'https://shdw-drive.genesysgo.net/9ZgbDbP9wL1oPegdNj66TH6tnazEMFcMnREJdKsKEMwx/triad.json',
                mint
            }, {
                skipPreflight: true,
                microLamports: 50000
            });
            console.log('Create Token:', token);
        });
        this.mintToken = () => __awaiter(this, void 0, void 0, function* () {
            const token = yield this.triadSpl404.mintToken({
                mysteryBoxName: this.mysteryBoxName,
                mint: new web3_js_1.PublicKey(this.mint)
            }, {
                skipPreflight: true,
                microLamports: 50000
            });
            console.log('Mint Token:', token);
        });
        this.transferToken = () => __awaiter(this, void 0, void 0, function* () {
            const amount = 0;
            const transfer = yield this.triadSpl404.transferToken({
                mysteryBoxName: this.mysteryBoxName,
                amount: new anchor_1.BN(amount * Math.pow(10, 6)),
                mint: new web3_js_1.PublicKey(this.mint),
                to: this.triadSpl404.provider.wallet.publicKey
            }, {
                skipPreflight: true,
                microLamports: 50000
            });
            console.log('Transfer Token:', transfer);
        });
        this.burnToken = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const amount = 3694.7314185;
                const transfer = yield this.triadSpl404.burnToken({
                    mysteryBoxName: this.mysteryBoxName,
                    amount: new anchor_1.BN(amount * Math.pow(10, 6)),
                    mint: new web3_js_1.PublicKey(this.mint)
                }, {
                    skipPreflight: true,
                    microLamports: 20000
                });
                axios_1.default.post('https://discord.com/api/webhooks/1250055492420763678/swD1lxfSRmkJhsuomH4ftv7FbCX1iuco4zJKgVhTfBYeacHZJfcOuCImuUYy7BgG1Q4l', {
                    content: `🔥 **${amount.toLocaleString()} $tTRIAD Tokens Burned!** 🔥\n
We're excited to announce that ${amount.toLocaleString()} $tTRIAD tokens have been successfully burned! 🚀🔥\n
[View the transaction on Solscan](https://solscan.io/tx/${transfer})\n
Thank you for your continued support! Together, we are making $tTRIAD stronger. 💪`
                });
                console.log('Burn Token:', transfer);
            }
            catch (_a) { }
        });
        this.swapToken = () => __awaiter(this, void 0, void 0, function* () {
            const swap = yield this.triadSpl404.swapToken({
                wallet: this.wallet.publicKey,
                mysteryBoxName: this.mysteryBoxName,
                nftMint: new web3_js_1.PublicKey('CHzDCgyfo4B7LpaxFED3Mz1G2bN61jaa4nruCewpxeXh'),
                tokenMint: new web3_js_1.PublicKey('t3DohmswhKk94PPbPYwA6ZKACyY3y5kbcqeQerAJjmV'),
                nftName: 'Triad 1458'
            }, {
                skipPreflight: true,
                microLamports: 20000
            });
            console.log('Swap Token:', swap);
        });
        this.getMints = () => __awaiter(this, void 0, void 0, function* () {
            const allAccounts = yield this.connection.getProgramAccounts(spl_token_1.TOKEN_2022_PROGRAM_ID, {
                commitment: 'confirmed',
                filters: [
                    {
                        memcmp: {
                            offset: 0,
                            bytes: this.mint
                        }
                    }
                ]
            });
            const accountsToWithdrawFrom = [];
            let amount = 0;
            for (const accountInfo of allAccounts) {
                const account = (0, spl_token_1.unpackAccount)(accountInfo.pubkey, accountInfo.account, spl_token_1.TOKEN_2022_PROGRAM_ID);
                const transferFeeAmount = (0, spl_token_1.getTransferFeeAmount)(account);
                if (transferFeeAmount !== null &&
                    transferFeeAmount.withheldAmount > BigInt(0)) {
                    accountsToWithdrawFrom.push(accountInfo.pubkey);
                    amount += Number(transferFeeAmount.withheldAmount);
                }
            }
            console.log('Amount:', amount);
        });
        this.burnNft = () => __awaiter(this, void 0, void 0, function* () {
            const nftName = '';
            try {
                const burnNFT = yield this.triadSpl404.burnNFT({
                    mysteryBoxName: this.mysteryBoxName,
                    mint: new web3_js_1.PublicKey('')
                }, {
                    skipPreflight: true,
                    microLamports: 25000
                });
                axios_1.default.post('https://discord.com/api/webhooks/1250055492420763678/swD1lxfSRmkJhsuomH4ftv7FbCX1iuco4zJKgVhTfBYeacHZJfcOuCImuUYy7BgG1Q4l', {
                    content: `🔥 **NFT ${nftName} Burned!** 🔥\n
We're excited to announce that NFT ${nftName} have been successfully burned! 🚀🔥\n
[View the transaction on Solscan](https://solscan.io/tx/${burnNFT})\n
Thank you for your continued support! Together, we are making TRIAD stronger. 💪`
                });
                console.log('Burn NFT:', burnNFT);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.default = Test;
