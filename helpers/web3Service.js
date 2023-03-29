const Web3 = require("web3");
const abi = require("./abi.js");
const BigNumber = require("bignumber.js");

const { ethers}=require("ethers");
const responseUtilities = require("./sendResponse");



let polygon = process.env.POLYGON_RPC_URL;  
let collectionAddress=process.env.NFT_COLLECTION_ADDRESS;
let nftGamePoints=JSON.parse(process.env.NFT_POINTS);
let tokenIds=JSON.parse(process.env.tokenIds);

let tokenAddress=process.env.BALLERS_TOKEN_ADDRESS;

let web3=new Web3(new Web3.providers.HttpProvider(polygon));
let nftContract = new web3.eth.Contract(abi.erc1155Abi,collectionAddress);


let tokenContract =new web3.eth.Contract(abi.standardTokenAbi,tokenAddress);

const getTokenBalance =async(data,response,cb)=>{

    if(!cb){
        cb=response;
    }
    try{

        let walletAddress=data.walletAddress;
        walletAddress=web3.utils.toChecksumAddress(walletAddress); 
        let  balance =   await tokenContract.methods.balanceOf(walletAddress).call();
        let tokenDecimal = await tokenContract.methods.decimals().call();
        const tokenbits = new BigNumber(10).pow(tokenDecimal);
        let tokenAmount = new BigNumber(balance).div(tokenbits);
        tokenAmount = tokenAmount.toString();
        return cb(null, tokenAmount);

    }
    catch(err){
        console.log(err);
        return cb(err);
    }

}








const getuserNftBalance=async (data) => {
console.log("data",data);



let walletLength=data.userPotDetailsDetails.length;
let userNftDetails=data.userPotDetailsDetails;
let finalArray=[];
let totalNftHeldInPoolPoints=0;
let totalInGameCashInPool=0


console.log("walletLength",walletLength);
console.log("tokenIds",tokenIds,typeof tokenIds);

for(let i= 0;i<tokenIds.length;i++){

    console.log("tokenIdDetails",tokenIds[i]);
    let extractWallets=data.userPotDetailsDetails.map((el)=>{
        return web3.utils.toChecksumAddress(el.walletAddress)
    })
    let tokenIdDetails= Array(extractWallets.length).fill(tokenIds[i]);
    let balanceOfbatch=await nftContract.methods.balanceOfBatch(extractWallets,tokenIdDetails).call();
    
    console.log("balance of b",i+1,balanceOfbatch,tokenIds[i]);

    finalArray.push(balanceOfbatch);

}
console.log("finalArray",finalArray);


for(let i in userNftDetails){
let count=0;

    for(let j in finalArray){
        let nftCount=parseFloat(finalArray[j][i]);
        if(nftCount>0){
            count+=1;
        }
    }
    userNftDetails[i].nftHolded=count;

    console.log("nftGamePoints",nftGamePoints);
    userNftDetails[i].nftPoints=nftGamePoints[count];
    totalNftHeldInPoolPoints+=nftGamePoints[count];
    if(count!=0){

        totalInGameCashInPool=new BigNumber(userNftDetails[i].amount).plus(totalInGameCashInPool);
    }
    console.log("Total in game cash",totalInGameCashInPool.toString());
}

for(let i in userNftDetails){
    console.log("totalNftHeldInPoolPoints",totalNftHeldInPoolPoints,userNftDetails[i].nftHolded);
     userNftDetails[i].nftPointsPercentage=(userNftDetails[i].nftPoints/totalNftHeldInPoolPoints)*100;
     userNftDetails[i].gamePointsPercentage=new BigNumber(userNftDetails[i].amount).div(totalInGameCashInPool).times(100);
     console.log("userNftDetails[i].amount",userNftDetails[i].gamePointsPercentage.toString());
     userNftDetails[i].rewardPointsPercentage =0.75*( userNftDetails[i].nftPointsPercentage)+0.25*( userNftDetails[i].gamePointsPercentage)
  
}





console.log("totalNftHeldInPool",totalNftHeldInPoolPoints,totalInGameCashInPool);

console.log("finalArray",userNftDetails);
    let dataToReturn = userNftDetails.map((el) => {
        return ({
            userPotDetailsId: el._id,
            nftHolded: el.nftHolded,
            rewardPointsPercentage: el.rewardPointsPercentage,
    })
    });
console.log("dataTo***************************Return",dataToReturn);
    return dataToReturn;

}




const createUserSignature =async function(data,response,cb){
    if(!cb){
        cb=response;
    }

    if(data.signatureExist){
		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"Withdrawls fetched Successfully",
				"getAllWithdrawls",
				response.data,
				data.req.signature
			)
		);
	}



    let tokenAddress=process.env.BALLERS_TOKEN_ADDRESS;
    let amount=data.amount;
    let nonce=data.nonce;
    let contractAddress=process.env.CLAIM_CONTRACT_ADDRESS;
    let privateKey=process.env.SIGNER_KEY;
    let callerAddress=data.walletAddress;

    let txn = {tokenAddress,amount,callerAddress,nonce,contractAddress};
    console.log(txn);
    let messages = ethers.utils.solidityKeccak256(
        ['address','uint256','address','uint256','address'],
        [txn.tokenAddress,txn.amount,txn.callerAddress,txn.nonce,txn.contractAddress]
    );   

    let messageBytes = ethers.utils.arrayify(messages);
    let signer = new ethers.Wallet(privateKey);
    let signature = await signer.signMessage(messageBytes);
    console.log("signature$$$$$$----",signature);
    let userSignature={
        signature
    }

    return cb(
        null,
        responseUtilities.responseStruct(
            200,
            "Withdrawls fetched Successfully",
            "getAllWithdrawls",
            userSignature,
            data.req.signature
));}



const createLotterySignature =async function(data,response,cb){
    if(!cb){
        cb=response;
    }

    if(data.signatureExist){
		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"Withdrawls fetched Successfully",
				"getAllWithdrawls",
				response.data,
				data.req.signature
			)
		);
	}




    

//   TODO  //change logic for this
    let quantity=data.potDetails.rewardTokenAmount;
    let nonce=data.nonce;
    let contractAddress=process.env.NFT_CLAIM_CONTRACT_ADDRESS;
    let privateKey=process.env.NFT_SIGNER_KEY;
    let callerAddress=data.walletAddress;
    let tokenId=data.potDetails.assetDetails.ticker;
    let txn = {tokenId,quantity,callerAddress,nonce,contractAddress};

    let messages = ethers.utils.solidityKeccak256(
        ['uint256','uint256','address','uint256','address'],
        [txn.tokenId,txn.quantity,txn.callerAddress,txn.nonce,txn.contractAddress]
    );   

  

    let messageBytes = ethers.utils.arrayify(messages);
    let signer = new ethers.Wallet(privateKey);
    let signature = await signer.signMessage(messageBytes);
    console.log("signature$$$$$$----",signature);
    let userSignature={
        signature
    }

    return cb(
        null,
        responseUtilities.responseStruct(
            200,
            "Withdrawls fetched Successfully",
            "getAllWithdrawls",
            userSignature,
            data.req.signature
));}







const getTransactionStatus=async function (data,response,cb){
    
    if(!cb){
        cb=response;
    }

    let web3 = new Web3(new Web3.providers.HttpProvider(polygon));
    
    try{
        let hash = data.txnHash;
        let receipt = await web3.eth.getTransactionReceipt(hash);
        console.log("receipt",receipt);
        let statusResponse;
        if (receipt) {
            console.log("RECEIPT", receipt)
            if (receipt.status == true) {
                statusResponse={
                    status: "COMPLETED"
                }

            }
            else if (receipt.status == false) {
                statusResponse={
                    status: "FAILED"
                }

            }
        }
        else {
            statusResponse={
                status: "PROCESSING"
            }
        }
        console.log("errrr");
        return cb(
            null,
            responseUtilities.responseStruct(
                200,
                "Withdrawls fetched Successfully",
                "getAllWithdrawls",
                statusResponse,
                data.req.signature
            ));
    
    }
    catch(err){
        console.log("errrr",err);
        return cb(
            responseUtilities.responseStruct(
                500,
                "getTransactionStatus",
                "getTransactionStatus",
                null,
                data.req.signature
            )
        );
    }

        
}



const checkUserHoldsNft=async function(data,response,cb){
if(!cb){
    cb=response;
}
    try{

        let walletAddress= web3.utils.toChecksumAddress(data.walletAddress);        let walletDetail= Array(tokenIds.length).fill(walletAddress);        let balanceOfbatch=await nftContract.methods.balanceOfBatch(walletDetail,tokenIds).call();
        console.log("balanceOfBatch",balanceOfbatch);
        let exist=false;
        balanceOfbatch.filter((el)=>{
            let value=parseFloat(el);
            console.log("value",value);
            if(value>0){
                exist=true; 
            }
        })
        if(!exist){
            return cb(
                responseUtilities.responseStruct(
                    400,
                    "No NFT found for this wallet address",
                    "checkUserHoldsNft",
                    null,
                    data.req.signature
                )
            );
        }
    
        return cb(
            null,
            responseUtilities.responseStruct(
                200,
                "check User Holds Nft",
                "checkUserHoldsNft",
                {exist:exist},
                data.req.signature
        ));
    }
    catch(err){

        return cb(
            responseUtilities.responseStruct(
                400,
                `${err}`,
                "checkUserHoldsNft",
                null,
                data.req.signature
            )
        );

    }
}






const checkNFTBalance =async function(data,response,cb){
    if(!cb){
        cb=response;
    }
    try{
       console.log("ass",response.data);
       let users=response.data.transactions;
       
        let count=response.data.count;
        let pageLimit=response.data.pageLimit;
        // let walletAddress= walletAddresses
        let walletAddresses=[];
         walletAddresses=users.map((el)=>{
            return web3.utils.toChecksumAddress(el.walletAddress)
        })
        // for(let i in users){
        //     if(users[i].walletAddress){
        //         let wallet = web3.utils.toChecksumAddress(users[i].walletAddress);
        //         walletAddresses.push(users[i].walletAddress)

        //     }
        // }
        console.log("walletAddresses--",walletAddresses);
        let finalMap=[];
        for(let i in tokenIds){
           let tokenIdDetails= Array(walletAddresses.length).fill(tokenIds[i]);
console.log("tokenIds",tokenIdDetails);
        let balanceOfbatch=await nftContract.methods.balanceOfBatch(walletAddresses,tokenIdDetails).call();
            console.log("balance of batch",balanceOfbatch,walletAddresses);
            finalMap.push(balanceOfbatch);        
        }

        for(let i in users){
            let count=0;
            
                for(let j in finalMap){
                    let nftCount=parseFloat(finalMap[j][i]);
                    if(nftCount>0){
                        count+=1;
                    }
                }
                users[i].nftHolded=count;
            
                
            }
            
    
        // console.log("users",users);
        // return;
    
        let sendRes = {
            transactions: users,
            count: count,
            pageLimit: pageLimit,
          };
        return cb(
            null,
            responseUtilities.responseStruct(
                200,
                "check User Holds Nft",
                "checkUserHoldsNft",
                sendRes,
                data.req.signature
        ));
    }
    catch(err){

        return cb(
            responseUtilities.responseStruct(
                400,
                `${err}`,
                "checkUserHoldsNft",
                null,
                data.req.signature
            )
        );

    }

}



// checkUserHoldsNft({walletAddress:"0xf09EDE432534583Efe8c0863292daC19da8ba6af"})




// getuserNftBalance(
//     {
//     "userPotDetailsDetails":[
//     {
//         "_id" : "63ad81340ad3d036518d172c",
//         "potId" : "63ad8073c2a633330e60b69f",
//         "walletAddress" : "0xd946F28962A96C45d9Bc16F16ca50d8350296A4E",
//         "amount" : 100000000000,
//         "userId" : "601e3c6ef5eb242d4408dcc7",
//         "createdAt" : "2022-12-29T11:59:48.619Z",
//         "updatedAt" : "2022-12-29T11:59:48.619Z",
//         "__v" : 0
//     },
    
//     /* 2 */
//     {
//         "_id" : "63aeb1171a829269ceb32390",
//         "potId" : "63ad8073c2a633330e60b69f",
//         "walletAddress" : "0xf09EDE432534583Efe8c0863292daC19da8ba6af",
//         "amount" : 100000000000,
//         "userId" : "601e3c6ef5eb242d4408dcc7",
//         "createdAt" : "2022-12-29T11:59:48.619Z",
//         "updatedAt" : "2022-12-29T11:59:48.619Z",
//         "__v" : 0
//     }
//     ,
//     /* 3 */
//     // {
//     //     "_id" : "63aeb17b08b5e90bba83bd06",
//     //     "nftHolded" : 0,
//     //     "rewardClaimed" : false,
//     //     "potId" : "63ad8073c2a633330e60b69f",
//     //     "walletAddress" : "0x7e6fBBc28F3b42c639369fD2cFD9F4806772536d",
//     //     "amount" : 100000000000,
//     //     "userId" : "601e3c6ef5eb242d4408dcc7",
//     //     "createdAt" : "2022-12-30T09:38:03.918Z",
//     //     "updatedAt" : "2022-12-30T09:38:03.918Z",
//     //     "__v" : 0
//     // }
// ]
//     }
// )



module.exports ={

    getuserNftBalance,
    createUserSignature,
    getTransactionStatus,
    checkUserHoldsNft,
    createLotterySignature,
    checkNFTBalance,
    getTokenBalance
}