const async = require("async");
const mongoose = require("mongoose");

const Withdrawls = require("../models/withdrawls");
const responseUtilities = require("../helpers/sendResponse");
const UserBalance =require("../models/userBalance");
const web3Service =require("../helpers/web3Service");
const createWithdrawl = function (data, response, cb) {
    if (!cb) {
		cb = response;
    }
    

    if (!data.potId || !data.walletAddress || !data.amount || !data.token.ticker || !data.token.contractAddress || !data.signature|| !data.nonce|| !data.hash|| !data.status ) {
		return cb(
			responseUtilities.responseStruct(
				400,
				null,
				"createWithdrawl",
				null,
				data.req.signature
			)
		);
    }
    

    let insertData = {
		potId: data.potId,
		token: {
			contractAddress: data.token.contractAddress,
			ticker: data.token.ticker,
		},
		walletAddress: data.walletAddress,
		amount: data.amount,
		signature: data.signature,
		nonce: data.nonce,
		hash: data.hash,
		status: data.status,
		userId: data.req.auth.id,

    };
    

    Withdrawls.create(insertData, (err, res) => {
		if (err) {
			console.log("Withdrawls Error : ", err);
			return cb(
				responseUtilities.responseStruct(
					500,
					"Error in creating Withdrawl",
					"createWithdrawl",
					null,
					data.req.signature
				)
			);
        }
        return cb(
		  null,
		  responseUtilities.responseStruct(
		    200,
		    "Withdrawl created Successfully",
		    "createWithdrawl",
		    res,
		    data.req.signature
		  )
		);
	
	});
  
};
exports.createWithdrawl = createWithdrawl;


const getAllWithdrawls = function (data, response, cb) {
	if (!cb) {
		cb = response;
	}

	Withdrawls.find()
		.populate("userId potId " )
		.exec((err, res) => {
		if (err) {
			console.error(err);
			return cb(
				responseUtilities.responseStruct(
					500,
					null,
					"getAllWithdrawls",
					null,
					data.req.signature
				)
			);
		}

		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"Withdrawls fetched Successfully",
				"getAllWithdrawls",
				res,
				data.req.signature
			)
		);
	});
}
exports.getAllWithdrawls = getAllWithdrawls;


const getWithdrawlById = function (data, response, cb) {
	if (!cb) {
		cb = response;
	}

	if (!data.WithdrawlId) {
		return cb(
			responseUtilities.responseStruct(
				400,
				"missing WithdrawlId",
				"getWithdrawlById",
				null,
				data.req.signature
			)
		);
	}

	let findData = {
		_id: data.WithdrawlId,
	};

	Withdrawls.find(findData).populate("userId potId").exec((err, res) => {
		if (err) {
			console.error(err);
			return cb(
				responseUtilities.responseStruct(
					500,
					null,
					"getWithdrawlById",
					null,
					data.req.signature
				)
			);
		}
		console.log("res", res);
		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"Withdrawl fetched successfuly",
				"getWithdrawlById",
				res,
				data.req.signature
			)
		);
	});


}
exports.getWithdrawlById = getWithdrawlById;


const createClaimWithdrawl = function(data,response,cb){

	if (!cb) {
		cb = response;
    }
    

    if (!data.potId || !data.walletAddress ) {
		return cb(
			responseUtilities.responseStruct(
				400,
				null,
				"createClaimWithdrawl",
				null,
				data.req.signature
			)
		);
    }
    

	let waterFallFunctions = [];
	waterFallFunctions.push(async.apply(getPotDetails,data));
	waterFallFunctions.push(async.apply(checkClaimExpired, data));
	waterFallFunctions.push(async.apply(checkIfUserBalanceExist, data));
	waterFallFunctions.push(async.apply(checkIfSignatureExist, data));
	waterFallFunctions.push(async.apply(getLatestNonce, data));
	waterFallFunctions.push(async.apply(web3Service.createUserSignature, data));
	waterFallFunctions.push(async.apply(initiateWithdrawl, data));
	async.waterfall(waterFallFunctions, cb);
}


const getPotDetails = function (data, response, cb) {
    if (!cb) {
		cb = response;
	}
	
	if (!data.potId) {
		return cb(
			responseUtilities.responseStruct(
				400,
				"missing potId",
				"getPotDetails",
				null,
				data.req.signature
			)
		);
	}

	let findData = {
		_id: data.potId,
	};

	RewardPot.findOne(findData).exec((err, res) => {
		if (err) {
			console.error(err);
			return cb(
				responseUtilities.responseStruct(
					500,
					null,
					"getPotDetails",
					null,
					data.req.signature
				)
			);
		}
		if (!res) {
			return cb(
				responseUtilities.responseStruct(
					400,
					"pot details not found",
					"getPotDetails",
					null,
					data.req.signature
				)
			);
		}
		data.potDetails = res;

		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"Reward Pot fetched successfuly",
				"getPotDetails",
				res,
				data.req.signature
			)
		);
	});

};

const checkClaimExpired = function (data, response, cb) {
    if (!cb) {
		cb = response;
	}
	if (!data.potDetails) {
		return cb(
			responseUtilities.responseStruct(
				400,
				"missing potDetails",
				"checkBalanceSubmissionDate",
				null,
				data.req.signature
			)
		);
	}

	let currentDate = new Date;
	console.log(currentDate)
	console.log(data.potDetails.startDate)
	console.log(data.potDetails.endDate)
	if (data.potDetails.endDate < currentDate && currentDate <= data.potDetails.claimExpiryDate) {
		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"User will able to claim",
				"checkClaimExpired",
				null,
				data.req.signature
			)
		);
	} else {
		return cb(
			responseUtilities.responseStruct(
				400,
				"User will not able to claim, out of date",
				"checkClaimExpired",
				null,
				data.req.signature
			)
		);
	}
};














const checkIfUserBalanceExist =function(data,response,cb){

	if(!cb){
		cb=response;
	}
	console.log(data.req.auth.id);
	let findData={
		potId:data.potId,
		userId:data.req.auth.id,
		walletAddress:data.walletAddress,
		// rewardClaimed:false

	};
		console.log("wallet",findData);
	UserBalance.findOne(findData).exec((err,res)=>{

		if(err){
			console.log("checkIfUserBalanceExist",err);

			return cb(
				responseUtilities.responseStruct(
					500,
					"Error in creating Withdrawl",
					"checkIfUserBalanceExist",
					null,
					data.req.signature
				)
			);

		}
		console.log(res);

		let userBal=res.amount;
		let nftCount=res.nftHolded;
		data.amount=res.amount;

		if(userBal>0&&nftCount>0){
	
			return cb(
				null,
				responseUtilities.responseStruct(
					200,
					"Withdrawls fetched Successfully",
					"getAllWithdrawls",
					res,
					data.req.signature
				)
			);
	
		}

		return cb(
			responseUtilities.responseStruct(
				400,
				"No balance exist for user",
				"checkIfUserBalanceExist",
				null,
				data.req.signature
			)
		);
	})

}
//to check if nonce exist for particular user for same pot
const checkIfUserNonceExist = function(data,response,cb){


	if(!cb){

		cb=response;
	}

	let findData={
		potId:data.potId,
		walletAddress:data.walletAddress,
		userId:data.req.auth.id
	};
	Withdrawls.findOne(findData).sort({"createdAt":-1}).exec((err,res)=>{
		if(err){
			return cb(
				responseUtilities.responseStruct(
					500,
					"Error in creating Withdrawl",
					"getLatestNonce",
					null,
					data.req.signature
				)
			);
		}
		console.log(res);
		if(res){
			data.nonce=res.nonce;
		}
		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"Withdrawls fetched Successfully",
				"getAllWithdrawls",
				res,
				data.req.signature
			)
		);




	})




}

const checkIfSignatureExist = function(data,response,cb){


	if(!cb){

		cb=response;
	}

	let findData={
		potId:data.potId,
		walletAddress:data.walletAddress,
		userId:data.req.auth.id
	};
	Withdrawls.findOne(findData).exec((err,res)=>{
		if(err){
			return cb(
				responseUtilities.responseStruct(
					500,
					"Error in creating Withdrawl",
					"getLatestNonce",
					null,
					data.req.signature
				)
			);
		}
		console.log(res);
		data.signatureExist=false;
		if(res){
			if(res.signature){
				
				data.signatureExist=true;
			}
		}
		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"Withdrawls fetched Successfully",
				"getAllWithdrawls",
				res,
				data.req.signature
			)
		);




	})


}


const getLatestNonce =function(data,response,cb){

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


	Withdrawls.find().sort({"createdAt":-1}).exec((err,res)=>{
		if(err){
			return cb(
				responseUtilities.responseStruct(
					500,
					"Error in creating Withdrawl",
					"getLatestNonce",
					null,
					data.req.signature
				)
			);
		}
		console.log(res);
		let nonceResponse = res;
		let latest=0;

		nonceResponse.filter((el)=>{
			if(el.nonce>latest){
			  latest=el.nonce;
			}
		})
		latest=parseFloat(latest);
		console.log("nonce",latest+1);
		data.nonce=latest+1;
		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"Withdrawls fetched Successfully",
				"getAllWithdrawls",
				res,
				data.req.signature
			)
		);




	})

}
exports.createClaimWithdrawl = createClaimWithdrawl;



const initiateWithdrawl =function(data,response,cb){
	if(!cb){
		cb=response;
	}
	
if(data.signatureExist){
	console.log("signature already exist");
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


	let signature = response.data.signature;
	console.log("resonse",response.data);

	let findData={
		potId:data.potId,
		walletAddress:data.walletAddress,
		userId:data.req.auth.id,
	};
	console.log(data.nonce);
	let updateData={
		"signature":signature,
		"nonce":data.nonce,
		"amount":data.amount
	}
	let options={
		upsert:true,
		new:true,
		setDefaultsOnInsert: true,

	}
	console.log("findData",findData,updateData,options);
	Withdrawls.findOneAndUpdate(findData,updateData,options).exec((err,res)=>{
		if(err){
			console.log("err",err);
			return cb(
				responseUtilities.responseStruct(
					500,
					"Error in creating Withdrawl",
					"getLatestNonce",
					null,
					data.req.signature
				)
			);
		}



		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"Withdrawls fetched Successfully",
				"getAllWithdrawls",
				res,
				data.req.signature
			)
		);
	})
}



const updateWithdrawl =function(data,response,cb){
	if(!cb){
		cb=response;

	}
	if (!data.potId || !data.walletAddress ||!data.txnHash ||!data.withdrawlId ) {
		return cb(
			responseUtilities.responseStruct(
				400,
				null,
				"updateWithdrawl",
				null,
				data.req.signature
			)
		);
    }


	let waterFallFunctions = [];
	waterFallFunctions.push(async.apply(web3Service.getTransactionStatus, data));
	waterFallFunctions.push(async.apply(updateTransactionDetails, data));
	waterFallFunctions.push(async.apply(updateUserBalance, data));

	async.waterfall(waterFallFunctions, cb);

    
}
exports.updateWithdrawl = updateWithdrawl;


const updateTransactionDetails =function(data,response,cb){
	if(!cb){
		cb=response;
	}
	let  transactionStatus=response.data;
	console.log("transactionStatus",transactionStatus,data.txnHash);
	let findData = {
        _id:data.withdrawlId,
		potId:data.potId,
		walletAddress:data.wupdateDataalletAddress,
		userId:data.req.auth.id

    }

	let updateData={
        hash:data.txnHash,
        status:transactionStatus.status,

    }

	Withdrawls.findOneAndUpdate(findData,updateData).exec((err,res)=>{
		if(err){
			console.log("err",err);
			return cb(
				responseUtilities.responseStruct(
					500,
					"Error in updating",
					"updateTransactionDetails",
					null,
					data.req.signature
				)
			);	
		}
		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"updated Successfully",
				"updateTransactionDetails",
				transactionStatus,
				data.req.signature
			)
		);
	})






}

const updateUserBalance =function(data,response,cb){
	if(!cb){
		cb=response;
	}
	let transactionStatus=response.data;
	let findData = {
		potId:data.potId,
		walletAddress:data.walletAddress,
		userId:data.req.auth.id
    }

	let updateData={
        rewardClaimed:transactionStatus.status=="COMPLETED"?true :false

    }

	UserBalance.findOneAndUpdate(findData,updateData).exec((err,res)=>{
		if(err){
			console.log("err",err);
			return cb(
				responseUtilities.responseStruct(
					500,
					"Error in updating",
					"updateTransactionDetails",
					null,
					data.req.signature
				)
			);	
		}
		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"updated Successfully",
				"updateTransactionDetails",
				res,
				data.req.signature
			)
		);
	})


}