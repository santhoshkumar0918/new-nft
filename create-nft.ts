import {
    closeEscrowAccount,
    createNft,fetchDigitalAsset,mplTokenMetadata
} from "@metaplex-foundation/mpl-token-metadata"

import {airdropIfRequired, getExplorerLink, getKeypairFromFile} from "@solana-developers/helpers"

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"

import {clusterApiUrl, Connection,LAMPORTS_PER_SOL} from "@solana/web3.js"
import { compareAmounts, generateSigner, keypairIdentity, percentAmount, publicKey } from "@metaplex-foundation/umi";
import { UnrecognizedArrayLikeSerializerSizeError } from "@metaplex-foundation/umi/serializers";




const connection = new Connection(clusterApiUrl("devnet"))

const user =  await getKeypairFromFile();

await airdropIfRequired(
    connection,
    user.publicKey,
    1  * LAMPORTS_PER_SOL,
    0.5 * LAMPORTS_PER_SOL
)

console.log("Created a user")

const umi =  createUmi(connection.rpcEndpoint)
umi.use(mplTokenMetadata())

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey)
umi.use(keypairIdentity(umiUser))

console.log("created umi instance ")

const collectionAdddress = publicKey("BS4N6nvhppBmgGZ3G91k8vKi8aVumbfWNUD8QTx5JjkX")

console.log("creating Nft")

const mint = generateSigner(umi)

const transcation = await createNft(umi,{
    mint,
    name : "NFT",
    uri : "",
    sellerFeeBasisPoints : percentAmount(0),
    collection : {
        key : collectionAdddress,
        verified : false,
    }
});

await transcation.sendAndConfirm(umi)

const createdNft = await fetchDigitalAsset(umi,mint.publicKey)

console.log(`created Nft ,, Address is ${getExplorerLink("address",
    createdNft.mint.publicKey,
    "devnet"
)}`)