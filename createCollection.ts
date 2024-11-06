import {
    createNft,fetchDigitalAsset,mplTokenMetadata
} from "@metaplex-foundation/mpl-token-metadata"

import {airdropIfRequired, getKeypairFromFile} from "@solana-developers/helpers"

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"

import {clusterApiUrl, Connection,LAMPORTS_PER_SOL} from "@solana/web3.js"
import { keypairIdentity } from "@metaplex-foundation/umi";


const connection  =  new Connection(clusterApiUrl("devnet"));

const user  = await  getKeypairFromFile();

await airdropIfRequired(
    connection,
    user.publicKey,
     1 * LAMPORTS_PER_SOL,
     0.5 * LAMPORTS_PER_SOL,
)

console.log("Loaded user", user.publicKey.toBase58())


const umi = createUmi(connection)
umi.use(mplTokenMetadata())

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey)
umi.use(keypairIdentity(umiUser))

console.log("Set up the umi User instance")