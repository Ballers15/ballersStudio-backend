const async = require("async");
const mongoose = require("mongoose");
const Users = require("../models/users");
const responseUtilities = require("../helpers/sendResponse");
const web3Service = require("../helpers/web3Service");
const RewardPot = require("../models/rewardPot");
const userPotDetails = require("../models/userPotDetails");
// ` Users.find({ createdAt : {$gte: data.startDate, $lt:data.endDate}})`


/**
 * 
 * @param {*} data 
 * @param {*} response 
 * @param {*} cb 
 * @returns baller token balance for particular address used in game
 */
const getTokenBalance =function(data,response,cb){
	if(!cb){
		cb=response;
	}
	if(!data.walletAddress){
		return cb(
			responseUtilities.responseStruct(
			  400,
			  null,
			  "getTokenBalance",
			  null,
			  null
			)
		)

	}
	web3Service.getTokenBalance(data,(err,res)=>{
		if(err){
			return cb(
				responseUtilities.responseStruct(
					400,
					err.message,
					"getTokenBalance",
					null,
					data.req.signature
				)
			);

		}
		let sendRes=res;
		return cb(null,responseUtilities.responseStruct(200,"Balance Fetched Successfuly","getTokenBalance",sendRes,null));


	})

}

exports.getTokenBalance=getTokenBalance;


/**
 * 
 * @param {*} data 
 * @param {*} response 
 * @param {*} cb 
 * @returns gives nft in particular wallet address 
 */
const getNftsInWalletAddress = function(data,response,cb){
	if(!cb){
		cb=response;
	}
	if(!data.walletAddress){
		return cb(
			responseUtilities.responseStruct(
			  400,
			  null,
			  "getNftsInWalletAddress",
			  null,
			  null
			)
		)

	}

	web3Service.getNftsInWalletAddress(data,(err,res)=>{
		if(err){
			console.log("HIIIIIIIIIIIIIIIIIII",err.message);
			return cb(
				responseUtilities.responseStruct(
					400,
					err.message,
					"getNftsInWalletAddress",
					null,
					data.req.signature
				)
			);

		}
		let sendRes=res;
		return cb(null,responseUtilities.responseStruct(200,"Balance Fetched Successfuly","getNftsInWalletAddress",sendRes,null));


	})

}
exports.getNftsInWalletAddress=getNftsInWalletAddress;



/**
 * 
 * @param {*} data 
 * @param {*} response 
 * @param {*} cb
 * @return gives all users 
 */
const getAllUsers = function (data, response, cb) {
	if (!cb) {
		cb = response;
	}
	
	let findData = {
		role:'USER',
	};
	let createdAt={};

	let projection = {
		_id: 1,
		role: 1,
		provider: 1,
		emailVerified: 1,
		isActive: 1,
		isBlocked:1,
		createdAt: 1,
		userName: 1,
		accountId: 1,
		email: 1,
		name: 1,
	};
	
	let limit = parseInt(process.env.pageLimit);
	let skip = 0;
	if (data.currentPage) {
	  skip = data.currentPage > 0 ? (data.currentPage - 1) * limit : 0;
	}


	if (data.startDate && data.endDate) {
		findData.createdAt = {
		  $gte: new Date(new Date(data.startDate).setHours(0, 0, 0, 0)),
		  $lte: new Date(new Date(data.endDate).setHours(23, 59, 59, 999)),
		};
	  }

	  if (data.startDate && !data.endDate) {
		findData.createdAt = {
		  $gte: new Date(new Date(data.startDate).setHours(0, 0, 0, 0)),
		};
	  }
	
	  if (data.endDate && !data.startDate) {
		findData.createdAt = {
		  $lte: new Date(new Date(data.endDate).setHours(23, 59, 59, 999)),
		};
	  }




	if(data.email){
		findData.email= { $regex: data.email, $options: "i" }
	}
	console.log(findData,'-----------------------find date')

	Users.find(findData,projection) .skip(skip).limit(limit).sort({ createdAt: -1 }).exec((err, res) => {
		if (err) {
			console.error(err);
			return cb(
				responseUtilities.responseStruct(
					500,
					null,
					"getAllUsers",
					null,
					data.req.signature
				)
			);
		}
		Users.countDocuments(findData, (err, count) => {
			if (err) {
			  console.error(err);
			  return cb(
				responseUtilities.responseStruct(
				  500,
				  null,
				  "getAllUsers",
				  null,
				  null
				)
			  );
			}
			return cb(
			  null,
			  responseUtilities.responseStruct(
				200,
				"Users fetched successfuly",
				"getAllUsers",
				{ Users:res,count: count,pageLimit:limit},
				null
			  )
			);
		  });
	});

	
}
exports.getAllUsers = getAllUsers;


/**
 * 
 * @param {*} data 
 * @param {*} response 
 * @param {*} cb 
 * @returns gives user game details (in game cash burned in our pots)
 */
const getUserGameDetails =function (data,response,cb){
	if(!cb){
		cb=response;
	}

	if(!data.userId){
		return cb(
			responseUtilities.responseStruct(
			  400,
			  null,
			  "getUserGameDetails",
			  null,
			  null
			)
		)
	}
	let waterFallFunctions = [];
	waterFallFunctions.push(async.apply(userWalletAddressDetails, data));
	waterFallFunctions.push(async.apply(userGameCashDetails, data));
	async.waterfall(waterFallFunctions, cb);

	
	

}
exports.getUserGameDetails=getUserGameDetails;


/**
 * 
 * @param {*} data 
 * @param {*} response 
 * @param {*} cb
 * @returns wallet details of user 
 */
const userWalletAddressDetails =function(data,response,cb){
	if(!cb){
		cb=response;
	}
	let findData={userId:data.userId};
	let field="walletAddress"
	userPotDetails.distinct(field,findData).exec((err,res)=>{
		if(err){
			console.log(err);
			return cb(
				responseUtilities.responseStruct(
				  500,
				  null,
				  "userWalletAddressDetails",
				  null,
				  null
				)
			  );
		}
		console.log("res",res);
		data.walletDetails=res;
		return cb(
			null,
			responseUtilities.responseStruct(
			  200,
			  "Users fetched successfuly",
			  "userWalletAddressDetails",
			  res,
			  null
			)
		  );
	})

}

const userGameCashDetails =function(data,response,cb){
	if(!cb){
		cb=response;
	}
	let pipeline=[
		{$match:{userId:mongoose.Types.ObjectId(data.userId)}},
		{$group:{
			_id:"$userId",
			totalSum:{$sum:"$amount"},
			rewardTokenAmount:{$sum:"$rewardedTokenAmount"}
			}
			
		}

	]
	
	userPotDetails.aggregate(pipeline).exec((err,res)=>{
		if(err){
			console.error(err);
			return cb(
				responseUtilities.responseStruct(
				  500,
				  null,
				  "userGameCashDetails",
				  null,
				  null
				)
			  );
		}
		console.log("res",data.walletDetails);
		let finalResponse={
			walletDetails:data.walletDetails,
			totalSum:res.length?res[0].totalSum:0,
			rewardTokenAmount:res.length?res[0].rewardTokenAmount:0

		}
		console.log("finalResponse",finalResponse)
		return cb(null,responseUtilities.responseStruct(200,null,"userGameCashDetails",finalResponse,null));
	})


}




/**
 * 
 * @param {*} data 
 * @param {*} response 
 * @param {*} cb 
 * @returns updates user status
 */
const updateUserStatus = function (data, response, cb) {
	if (!cb) {
	  cb = response;
	}
	if (!data.userId) {
	  return cb(
		responseUtilities.responseStruct(
		  400,
		  null,
		  "updateUserStatus",
		  null,
		  data.req.signature
		)
	  );
	}
  
	let findData = {
	  _id: data.userId,
	  role: "USER",
	};
  
	let updateData = {
	  isBlocked: data.isBlocked,
	};
  
  
	Users.findOneAndUpdate(findData, updateData).exec(function (err, res) {
	  if (err) {
		console.error(err);
		return cb(
		  responseUtilities.responseStruct(
			500,
			null,
			"updateUserStatus",
			null,
			null
		  )
		);
	  }
	
	  console.log("DATA", data.mailjetId);
	  return cb(
		null,
		responseUtilities.responseStruct(
		  200,
		  "user Status Updated",
		  "updateUserStatus",
		  null,
		  data.req.signature
		)
	  );
	});
  };
exports.updateUserStatus=updateUserStatus;


/**
 * 
 * @param {*} data 
 * @param {*} response 
 * @param {*} cb
 * @returns give user count total and unique wallet addresses in system 
 */
const getUserCount =function(data,response,cb){
	if(!cb){
		cb=response;
	}

	let waterFallFunctions = [];
	waterFallFunctions.push(async.apply(getTotalUserCount, data));
	waterFallFunctions.push(async.apply(getUniqueWalletAddressCount, data));
	async.waterfall(waterFallFunctions, cb);



}
exports.getUserCount=getUserCount;


const getTotalUserCount =async function(data,response,cb){
	if(!cb){
		cb=response;
	}

	let totalUserCount =await Users.find();
	let incompleteSignups =await Users.find({emailVerified:false});
let sendRes={
	totalUserCount:totalUserCount.length,
	incompleteSignups:incompleteSignups.length
}

 return cb(
		null,
		responseUtilities.responseStruct(
		  200,
		  "Total User Count",
		  "getTotalUserCount",
		  sendRes,
		  data.req.signature
		)
	  );
}


const getUniqueWalletAddressCount =function(data,response,cb){
	if(!cb){
		cb=response;
	}

	if(!cb){
		cb=response;
	}
	let field="walletAddress"
	userPotDetails.distinct(field).exec((err,res)=>{
		if(err){
			console.log(err);
			return cb(
				responseUtilities.responseStruct(
				  500,
				  null,
				  "getUniqueWalletAddressCount",
				  null,
				  null
				)
			  );
		}
		console.log("response.data",response.data);
		let sendRes =response.data;
		console.log("res",res);
		sendRes["uniqueWalletAddress"]=res.length
		return cb(
			null,
			responseUtilities.responseStruct(
			  200,
			  "getUniqueWalletAddressCount",
			  "getUniqueWalletAddressCount",
			  sendRes,
			  null
			)
		  );
	})


}
