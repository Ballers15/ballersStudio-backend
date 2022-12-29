const async = require("async");
const mongoose = require("mongoose");

const transactions = require("../models/transactions");
const responseUtilities = require("../helpers/sendResponse");


const createTransaction = function (data, response, cb) {
    if (!cb) {
		cb = response;
    }
    

    if (!data.potId || !data.walletAddress || !data.amount || !data.token.ticker || !data.token.contractAddress || !data.signature|| !data.nonce|| !data.hash|| !data.status ) {
		return cb(
			responseUtilities.responseStruct(
				400,
				null,
				"createTransaction",
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
    

    transactions.create(insertData, (err, res) => {
		if (err) {
			console.log("Transactions Error : ", err);
			return cb(
				responseUtilities.responseStruct(
					500,
					"Error in creating transaction",
					"createTransaction",
					null,
					data.req.signature
				)
			);
        }
        return cb(
		  null,
		  responseUtilities.responseStruct(
		    200,
		    "Transaction created Successfully",
		    "createTransaction",
		    res,
		    data.req.signature
		  )
		);
	
	});
  
};
exports.createTransaction = createTransaction;


const getAllTransactions = function (data, response, cb) {
	if (!cb) {
		cb = response;
	}
	

	transactions.find()
		.populate("userId potId " )
		.exec((err, res) => {
		if (err) {
			console.error(err);
			return cb(
				responseUtilities.responseStruct(
					500,
					null,
					"getAllTransactions",
					null,
					data.req.signature
				)
			);
		}

		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"Transactions fetched Successfully",
				"getAllTransactions",
				res,
				data.req.signature
			)
		);
	});
}
exports.getAllTransactions = getAllTransactions;


const getTransactionById = function (data, response, cb) {
	if (!cb) {
		cb = response;
	}

	if (!data.transactionId) {
		return cb(
			responseUtilities.responseStruct(
				400,
				"missing transactionId",
				"getTransactionById",
				null,
				data.req.signature
			)
		);
	}

	let findData = {
		_id: data.transactionId,
	};

	transactions.find(findData).populate("userId potId").exec((err, res) => {
		if (err) {
			console.error(err);
			return cb(
				responseUtilities.responseStruct(
					500,
					null,
					"getTransactionById",
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
				"Transaction fetched successfuly",
				"getTransactionById",
				res,
				data.req.signature
			)
		);
	});


}
exports.getTransactionById = getTransactionById;