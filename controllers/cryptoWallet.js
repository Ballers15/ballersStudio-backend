const async = require("async");
const mongoose = require("mongoose");

const CryptoWallet = require("../models/cryptoWallet");
const responseUtilities = require("../helpers/sendResponse");




const addCryptoWallet = function (data, response, cb) {
    if (!cb) {
      cb = response;
    }
  
    if (!data.walletAddress || !data.chain) {
      return cb(
        responseUtilities.responseStruct(
          400,
          null,
          "addCryptoWallet",
          null,
          data.req.signature
        )
      );
	}
	
	data.walletAddress=(data.walletAddress).toLowerCase();
  
  let findData = {
    walletAddress: data.walletAddress,
    chain:data.chain
  }
  let updateData = {
    walletAddress: data.walletAddress,
    chain: data.chain,
    userId:data.req.auth.id
  };
  let options = {
    upsert: true,
    new: true,
  };

	CryptoWallet.findOneAndUpdate(findData, updateData, options,(err, res) => {
		if (err) {
			console.error(err);
			return cb(
				responseUtilities.responseStruct(
					500,
					null,
					"addCryptoWallet",
					null,
					data.req.signature
				)
			);
		}

		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"Chain and walletAddress created Successfully",
				"addCryptoWallet",
				null,
				data.req.signature
			)
		);
	});
  
  };
exports.addCryptoWallet = addCryptoWallet;

const getAllCryptoWallets = function (data, response, cb) {
	if (!cb) {
		cb = response;
	}
	
	
	CryptoWallet.find()
		.populate("userId" )
		.exec((err, res) => {
		if (err) {
			console.error(err);
			return cb(
				responseUtilities.responseStruct(
					500,
					null,
					"getAllCryptoWallets",
					null,
					data.req.signature
				)
			);
		}

		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"Crypto Wallets fetched Successfully",
				"getAllCryptoWallets",
				res,
				data.req.signature
			)
		);
	});
}
exports.getAllCryptoWallets = getAllCryptoWallets;


const getCryptoWalletById = function (data, response, cb) {
	if (!cb) {
		cb = response;
	}

	if (!data.walletId) {
		return cb(
			responseUtilities.responseStruct(
				400,
				"missing walletId",
				"getCryptoWalletById",
				null,
				data.req.signature
			)
		);
	}

	let findData = {
		_id: data.walletId,
	};

	CryptoWallet.find(findData).populate("userId").exec((err, res) => {
		if (err) {
			console.error(err);
			return cb(
				responseUtilities.responseStruct(
					500,
					null,
					"getCryptoWalletById",
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
				"Crypto Wallet fetched successfuly",
				"getCryptoWalletById",
				res,
				data.req.signature
			)
		);
	});


}
exports.getCryptoWalletById = getCryptoWalletById;