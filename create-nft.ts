import {
    closeEscrowAccount,
    createNft, fetchDigitalAsset, mplTokenMetadata
} from "@metaplex-foundation/mpl-token-metadata";
import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { compareAmounts, generateSigner, keypairIdentity, percentAmount, publicKey } from "@metaplex-foundation/umi";

const connection = new Connection(clusterApiUrl("devnet"));
const user = await getKeypairFromFile();

await airdropIfRequired(
    connection,
    user.publicKey,
    1 * LAMPORTS_PER_SOL,
    0.5 * LAMPORTS_PER_SOL
);

console.log("Created a user");

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));

console.log("Created umi instance");

const collectionAddress = publicKey("7p7Z1cTzbt78kvShDQ1ovY1hCikkEyCjy5jTx2FEgn8o");

console.log("Creating NFT");

const mint = generateSigner(umi);

try {
    const transaction = await createNft(umi, {
        mint,
        name: "NFT",
        uri: "https://builtin.com/sites/www.builtin.com/files/2024-10/Blockchain%20Technology%20from%20Builtin.jpg",
        sellerFeeBasisPoints: percentAmount(0),
        collection: {
            key: collectionAddress,
            verified: false,
        }
    });

    console.log("Sending transaction to create NFT...");
    const signature = await transaction.sendAndConfirm(umi);
    console.log("Transaction confirmed with signature:", signature);

    // Fetching and verifying created NFT
    const createdNft = await fetchDigitalAsset(umi, mint.publicKey);
    console.log(`Created NFT, Address: ${getExplorerLink("address", createdNft.mint.publicKey, "devnet")}`);
} catch (error) {
    console.error("Error creating NFT:", error);
}
