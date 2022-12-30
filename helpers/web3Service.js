const Web3 = require("web3");
const abi = require("./abi.js");

// let polygon = process.env.POLYGON_RPC_URL;  
let polygon="https://rpc-mumbai.maticvigil.com"
let web3=new Web3(new Web3.providers.HttpProvider(polygon));



const getuserNftBalance=async (data) => {
console.log("data",data);
// let collectionAddress=process.env.NFT_COLLECTION_ADDRESS;
let collectionAddress="0x2953399124f0cbb46d2cbacd8a89cf0599974963";

let nftContract = new web3.eth.Contract(abi.erc1155Abi,collectionAddress);

let walletLength=data.userBalanceDetails.length;

// let tokenIds=process.env.tokenIds;
let tokenIds=["98277241363622211034989449555441005204792120988639821933054095666973006364804","98277241363622211034989449555441005204792120988639821933054095662574959853700","98277241363622211034989449555441005204792120988639821933054095664773983109252","98277241363622211034989449555441005204792120988639821933054095665873494737028","98277241363622211034989449555441005204792120988639821933054095663674471481476"]

let userNftDetails=data.userBalanceDetails;
let finalArray=[];
for(let i= 0;i<tokenIds.length;i++){

    console.log("tokenIdDetails",tokenIds[i]);
    let extractWallets=data.userBalanceDetails.map((el)=>{
        return el.walletAdress
    })
    let tokenIdDetails= Array(extractWallets.length).fill(tokenIds[i]);
    let balanceOfbatch=await nftContract.methods.balanceOfBatch(extractWallets,tokenIdDetails).call();
    
    // userBalanceDetails.map((el)=>{
    //     // ...el,"nftHold"
    // })
    console.log("balance of b",i+1,balanceOfbatch,tokenIds[i]);

    finalArray.push(balanceOfbatch);

}

let userNftSum=[];


for(let i in userNftDetails){
let count=0;

    for(let j in finalArray){
        count+=parseFloat(finalArray[j][i]);
    }
    userNftDetails[i].nftHolded=count;
    
}
console.log("finalArray",userNftDetails);


}

getuserNftBalance(
    {
    "userBalanceDetails":[
    {
        "_id" : "63ad81340ad3d036518d172c",
        "potId" : "63ad8073c2a633330e60b69f",
        "walletAdress" : "0xd946F28962A96C45d9Bc16F16ca50d8350296A4E",
        "amount" : 1e+20,
        "userId" : "601e3c6ef5eb242d4408dcc7",
        "createdAt" : "2022-12-29T11:59:48.619Z",
        "updatedAt" : "2022-12-29T11:59:48.619Z",
        "__v" : 0
    },
    
    /* 2 */
    {
        "_id" : "63aeb1171a829269ceb32390",
        "potId" : "63ad8073c2a633330e60b69f",
        "walletAdress" : "0xf09EDE432534583Efe8c0863292daC19da8ba6af",
        "amount" : 1.63609149704,
        "userId" : "601e3c6ef5eb242d4408dcc7",
        "createdAt" : "2022-12-29T11:59:48.619Z",
        "updatedAt" : "2022-12-29T11:59:48.619Z",
        "__v" : 0
    }
    ,
    /* 3 */
    {
        "_id" : "63aeb17b08b5e90bba83bd06",
        "nftHolded" : 0,
        "rewardClaimed" : false,
        "potId" : "63ad8073c2a633330e60b69f",
        "walletAdress" : "0x7e6fBBc28F3b42c639369fD2cFD9F4806772536d",
        "amount" : 1.63609149704,
        "userId" : "601e3c6ef5eb242d4408dcc7",
        "createdAt" : "2022-12-30T09:38:03.918Z",
        "updatedAt" : "2022-12-30T09:38:03.918Z",
        "__v" : 0
    }
]
    }
)






















module.exports ={

    getuserNftBalance
}