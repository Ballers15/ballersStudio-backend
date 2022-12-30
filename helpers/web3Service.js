const Web3 = require("web3");
const abi = require("./abi.js");

let polygon = process.env.POLYGON_RPC_URL;  
let web3=new Web3(new Web3.providers.HttpProvider(polygon));



const getuserNftBalance=async (data) => {

let collectionAddress=process.env.NFT_COLLECTION_ADDRESS;

let nftContract = new web3.eth.Contract(abi.erc1155Abi,collectionAddress);

let walletLength=data.wallets.length;

let tokenIds=process.env.tokenIds;

for(let i= 0;i<tokenIds.length;i++){

    console.log("tokenIdDetails",tokenIds[i],walletLength);
    let tokenIdDetails= Array(walletLength).fill(tokenIds[i]);
    console.log(tokenIdDetails);
    let balanceOfbatch=await nftContract.methods.balanceOfBatch(data.wallets,tokenIdDetails).call();
    console.log("balance of b",i+1,balanceOfbatch);
}




}























module.exports ={

    getuserNftBalance
}