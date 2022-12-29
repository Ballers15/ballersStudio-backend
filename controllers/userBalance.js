const async = require("async");
const mongoose = require("mongoose");

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
	waterFallFunctions.push(async.apply(addBalanceForUser, data));
	async.waterfall(waterFallFunctions, cb);
  
};
exports.addUserBalance = addUserBalance;

const addBalanceForUser = function (data, response, cb) {

    if (!cb) {
		cb = response;
    }
    console.log(data,'39')

	let insertData = {
		potId:data.potId,
        walletAdress: data.walletAdress,
        amount:data.amount,
		userId: data.req.auth.id,
    };
    console.log()

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

	UserBalance.find(findData).populate("userId potId").exec((err, res) => {
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