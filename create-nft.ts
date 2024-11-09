import {
    closeEscrowAccount,
    createNft,fetchDigitalAsset,mplTokenMetadata
} from "@metaplex-foundation/mpl-token-metadata"

import {airdropIfRequired, getExplorerLink, getKeypairFromFile} from "@solana-developers/helpers"

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"

import {clusterApiUrl, Connection,LAMPORTS_PER_SOL} from "@solana/web3.js"
import { compareAmounts, generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
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