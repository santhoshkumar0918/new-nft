import {
    closeEscrowAccount,
    createNft,fetchDigitalAsset,mplTokenMetadata
} from "@metaplex-foundation/mpl-token-metadata"

import {airdropIfRequired, getExplorerLink, getKeypairFromFile} from "@solana-developers/helpers"

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"

import {clusterApiUrl, Connection,LAMPORTS_PER_SOL} from "@solana/web3.js"
import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";


const connection  =  new Connection(clusterApiUrl("devnet"));

const user  = await  getKeypairFromFile();

await airdropIfRequired(
    connection,
    user.publicKey,
     1 * LAMPORTS_PER_SOL,
     0.5 * LAMPORTS_PER_SOL,
)

console.log("Loaded user", user.publicKey.toBase58())


const umi = createUmi(connection.rpcEndpoint)
umi.use(mplTokenMetadata())

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey)
umi.use(keypairIdentity(umiUser))

console.log("Set up the umi User instance")

const collectionMint = generateSigner(umi)

const transcation = await createNft(
   umi,{
    mint: collectionMint,
    name:"My Collection",
    symbol:"MC",
    uri:"https://raw.githubusercontent.com/santhoshkumar0918/new-nft/refs/heads/main/nft-collection/metadata/metadata.json",
    sellerFeeBasisPoints:percentAmount(0),
    isCollection:true


   }
)

await transcation.sendAndConfirm(umi)

const createdCollectionNft = await fetchDigitalAsset(umi,collectionMint.publicKey)

console.log(`Created Collection ! Address is ${getExplorerLink(
    "address",
    createdCollectionNft.mint.publicKey,
    "devnet"
)} `)
