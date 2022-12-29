const async = require("async");
const mongoose = require("mongoose");
const RewardPot = require("../models/rewardPot");
const UserBalance = require("../models/userBalance");
const responseUtilities = require("../helpers/sendResponse");


const addUserBalance = function (data, response, cb) {
    if (!cb) {
		cb = response;
    }

    if (!data.walletAdress || !data.amount ||!data.potId) {
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
	let currentDate = new Date
	if (data.potDetails.startDate < currentDate && currentDate <= data.potDetails.endDate) {
		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"User will able to add balance",
				"checkBalanceSubmissionDate",
				null,
				data.req.signature
			)
		);
	} else {
		return cb(
			responseUtilities.responseStruct(
				400,
				"User will not able to add balance, out of date",
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

	let insertData = {
		potId:data.potId,
        walletAdress: data.walletAdress,
        amount:data.amount,
		userId: data.req.auth.id,
    };

    UserBalance.create(insertData, (err, res) => {
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