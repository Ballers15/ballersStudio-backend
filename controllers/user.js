const async = require("async");
const mongoose = require("mongoose");
const Users = require("../models/users");
const responseUtilities = require("../helpers/sendResponse");
const web3Service = require("../helpers/web3Service");
const RewardPot = require("../models/rewardPot");
const userPotDetails = require("../models/userPotDetails");
// ` Users.find({ createdAt : {$gte: data.startDate, $lt:data.endDate}})`


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
	if (data.startDate) {
		createdAt["$gte"] = new Date(data.startDate);
  }
	if (data.endDate) {
		createdAt["$lte"] = new Date(data.endDate);
	}
	if (data.startDate || data.endDate) {
		findData.createdAt = createdAt;
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