const async = require("async");
const mongoose = require("mongoose");
const RewardPot = require("../models/rewardPot");
const UserBalance = require("../models/userBalance");
const responseUtilities = require("../helpers/sendResponse");
const web3Service=require("../helpers/web3Service");

const addUserBalance = function (data, response, cb) {
    if (!cb) {
		cb = response;
    }

    if (!data.walletAddress || !data.amount ||!data.potId) {
		return cb(
			responseUtilities.responseStruct(
				400,
				null,
				"addUserBalance",
				null,
				data.req.signature
			)
		);
    }

    let waterFallFunctions = [];
	// waterFallFunctions.push(async.apply(getUserGameBalance, data));	
	waterFallFunctions.push(async.apply(web3Service.checkUserHoldsNft,data));

	waterFallFunctions.push(async.apply(getPotDetails, data));
	waterFallFunctions.push(async.apply(checkBalanceSubmissionDate, data));
	waterFallFunctions.push(async.apply(addBalanceForUser, data));
	// waterFallFunctions.push(async.apply(updateUserGameBalance, data));	

	async.waterfall(waterFallFunctions, cb);
  
};
exports.addUserBalance = addUserBalance;

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

const checkBalanceSubmissionDate = function (data, response, cb) {
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

	let currentDate = new Date
	console.log(currentDate)
	console.log(data.potDetails.startDate)
	console.log(data.potDetails.endDate)
	if (data.potDetails.startDate < currentDate && currentDate <= data.potDetails.endDate) {
		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"User will able to add",
				"checkBalanceSubmissionDate",
				null,
				data.req.signature
			)
		);
	} else {
		return cb(
			responseUtilities.responseStruct(
				400,
				"User will not able to add, out of date",
				"checkBalanceSubmissionDate",
				null,
				data.req.signature
			)
		);
	}
};

const addBalanceForUser = function (data, response, cb) {
    if (!cb) {
		cb = response;
    }

	let findData = {
		potId:data.potId,
        walletAddress: data.walletAddress,
		userId: data.req.auth.id,
    };

	let updateData = {
		$inc: { amount: data.amount },
	}

	let options = {
		upsert: true,
		new: true,
	  };
    UserBalance.findOneAndUpdate(findData,updateData,options, (err, res) => {
		if (err) {
			console.log("UserBalance Error : ", err);
			return cb(
				responseUtilities.responseStruct(
					500,
					"Error in creating UserBalance",
					"addBalanceForUser",
					null,
					data.req.signature
				)
			);
        }
        return cb(
		  null,
		  responseUtilities.responseStruct(
		    200,
		    "User Balance Added Successfully",
		    "addBalanceForUser",
		    res,
		    data.req.signature
		  )
		);
    });
};

const updateLotterNumber = function (data, response, cb) {
	if (!cb) {
		cb = response;
	}

	if (!data.walletAddress ||!data.potId||!data.lotteryNumbers) {
		return cb(
			responseUtilities.responseStruct(
				400,
				null,
				"updateLotterNumber",
				null,
				data.req.signature
			)
		);
	}
	

    let waterFallFunctions = [];
	waterFallFunctions.push(async.apply(getPotDetails, data));
	waterFallFunctions.push(async.apply(checkBalanceSubmissionDate, data));
	waterFallFunctions.push(async.apply(addLotterNumber, data));

	async.waterfall(waterFallFunctions, cb);
}
exports.updateLotterNumber = updateLotterNumber;


const  addLotterNumber = async function (data, response, cb) {
    if (!cb) {
		cb = response;
	}
	if (!data.lotteryNumbers || !data.potId || !data.walletAddress) {
		console.log("data", data);
		return cb(
			responseUtilities.responseStruct(
				400,
				null,
				"addLotterNumber",
				null,
				data.req.signature
			)
		);
	}

	let findData = {
		potId:data.potId,
        walletAddress: data.walletAddress,
		userId: data.req.auth.id
	};

	let options = {
		upsert: true,
	};
	
	let updateData = { "$addToSet": { "lotteryNumbers": { $each: data.lotteryNumbers } } };

	UserBalance.findOneAndUpdate(findData,updateData,options, (err, res) => {
		if (err) {
			console.log("UserBalance Error : ", err);
			return cb(
				responseUtilities.responseStruct(
					500,
					"Error in adding lottery number",
					"addLotterNumber",
					null,
					data.req.signature
				)
			);
        }
        return cb(
		  null,
		  responseUtilities.responseStruct(
		    200,
		    "Lottery number added succesfully",
		    "addLotterNumber",
		    res,
		    data.req.signature
		  )
		);
    });
	
	

	
};

const getAllUserBalances = function (data, response, cb) {
	if (!cb) {
		cb = response;
	}
	
	
	UserBalance.find()
		.populate("userId potId" )
		.exec((err, res) => {
		if (err) {
			console.error(err);
			return cb(
				responseUtilities.responseStruct(
					500,
					null,
					"getAllUserBalances",
					null,
					data.req.signature
				)
			);
		}

		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"User Balances fetched Successfully",
				"getAllUserBalances",
				res,
				data.req.signature
			)
		);
	});
}
exports.getAllUserBalances = getAllUserBalances;

const getUserBalanceById = function (data, response, cb) {
	if (!cb) {
		cb = response;
	}

	if (!data.balanceId) {
		return cb(
			responseUtilities.responseStruct(
				400,
				"missing balanceId",
				"getUserBalanceById",
				null,
				data.req.signature
			)
		);
	}

	let findData = {
		_id: data.balanceId,
	};

	UserBalance.find(findData).populate("potId").exec((err, res) => {
		if (err) {
			console.error(err);
			return cb(
				responseUtilities.responseStruct(
					500,
					null,
					"getUserBalanceById",
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
				"User Balance fetched successfuly",
				"getUserBalanceById",
				res,
				data.req.signature
			)
		);
	});


}
exports.getUserBalanceById = getUserBalanceById;