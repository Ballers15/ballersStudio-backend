const async = require("async");
const mongoose = require("mongoose");
const PotActionLogs=require("../models/potActionLogs")
const RewardPot = require("../models/rewardPot");
const responseUtilities = require("../helpers/sendResponse");

const createRewardPot = function (data, response, cb) {
    if (!cb) {
		cb = response;
    }

    if (!data.rewardTokenAmount || !data.assetDetails.contractAddress || !data.startDate || !data.endDate || !data.assetType || !data.potType ) {
		return cb(
			responseUtilities.responseStruct(
				400,
				null,
				"createRewardPot",
				null,
				data.req.signature
			)
		);
	}

	let waterFallFunctions = [];
	waterFallFunctions.push(async.apply(addRewardPot, data));
	waterFallFunctions.push(async.apply(potActionLogs, data));
	async.waterfall(waterFallFunctions, cb);
  

};
exports.createRewardPot = createRewardPot;


const addRewardPot = function (data, response, cb) {
	if (!cb) {
		cb = response;
	}

	let insertData = {
		rewardTokenAmount: data.rewardTokenAmount,
		assetDetails: {
			contractAddress: data.assetDetails.contractAddress,
			ticker: data.assetDetails.ticker,
			assetName:data.assetDetails.assetName
		},
		startDate: data.startDate,
		endDate: data.endDate,
		assetType: data.assetType,
		potType: data.potType,
		createdBy: data.req.auth.id,

    };
    
    RewardPot.create(insertData, (err, res) => {
		if (err) {
			console.log("RewardPot Error : ", err);
			return cb(
				responseUtilities.responseStruct(
					500,
					"Error in creating RewardPot",
					"addRewardPot",
					null,
					data.req.signature
				)
			);
		}
		
		data.insertActionLogData = {
			potId: res._id,
			addedBy: data.req.auth.id,
			message: "Added new config details"   // in case of edit "Edit the config details"
		};
		
		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"Pot added succesfully",
				"addRewardPot",
				null,
				data.req.signature
			)
		);

	});
	
}

const potActionLogs = function (data, response, cb) {
	if (!cb) {
	  cb = response;
	}
	if (!data.insertActionLogData.potId) {
		return cb(
			responseUtilities.responseStruct(
				400,
				null,
				"potActionLogs",
				null,
				data.req.signature	
			)
		);
	}
	
	PotActionLogs.create(data.insertActionLogData, (err, res) => {
	  if (err) {
		console.error(err);
		return cb(
		  responseUtilities.responseStruct(
			500,
			null,
			"addIdeaLogs",
			null,
			data.req.signature
		  )
		);
	  }
  
	  return cb(
		null,
		responseUtilities.responseStruct(
		  200,
		  "add Pot Action Logs",
		  "addPotActionLogs",
		  null,
		  data.req.signature
		)
	  );
	});
  }

const updateRewardPot = function (data, response, cb) {
	if (!cb) {
		cb = response;
	}

	if (!data.potId||!data.rewardTokenAmount || !data.assetDetails.contractAddress || !data.startDate || !data.endDate || !data.assetType || !data.potType ) {
		return cb(
			responseUtilities.responseStruct(
				400,
				null,
				"updateRewardPot",
				null,
				data.req.signature
			)
		);
	}

	let waterFallFunctions = [];
	waterFallFunctions.push(async.apply(updatePot, data));
	waterFallFunctions.push(async.apply(potActionLogs, data));
	async.waterfall(waterFallFunctions, cb);
}
exports.updateRewardPot = updateRewardPot;

const updatePot = function (data, response, cb) {
	if (!cb) {
		cb = response;
	}

	let updateData = {
		rewardTokenAmount: data.rewardTokenAmount,
		assetDetails: {
			contractAddress: data.assetDetails.contractAddress,
			ticker: data.assetDetails.ticker,
			assetName:data.assetDetails.assetName
		},
		startDate: data.startDate,
		endDate: data.endDate,
		assetType: data.assetType,
		potType: data.potType,
	};
	
	let findData = {
		_id: data.potId,
	};

	RewardPot.findOneAndUpdate(findData, updateData, (err, res) => {
		if (err) {
			console.error(err);
			return cb(
				responseUtilities.responseStruct(
					500,
					null,
					"updatePot",
					null,
					data.req.signature
				)
			);
		}

		data.insertActionLogData = {
			potId: res._id,
			editedBy: data.req.auth.id,
			message: "Edit the config details"   
		};

		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"Pot updated succesfully",
				"updatePot",
				null,
				data.req.signature
			)
		);

	});
}

const deleteRewardPot = function (data, response, cb) {
	if (!cb) {
		cb = response;
	}
	if (!data.potId) {
		return cb(
			responseUtilities.responseStruct(
				400,
				"potId is required",
				"deleteRewardPot",
				null,
				data.req.signature
			)
		);
	}

	let updateData = {
		isActive: false
	};
	
	let findData = {
		_id: data.potId,
	};

	RewardPot.findOneAndUpdate(findData, updateData, (err, res) => {
		if (err) {
			console.error(err);
			return cb(
				responseUtilities.responseStruct(
					500,
					null,
					"deleteRewardPot",
					null,
					data.req.signature
				)
			);
		}

		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"Reward Pot Deleted Successfully",
				"deleteRewardPot",
				null,
				data.req.signature
			)
		);
	});
}
exports.deleteRewardPot = deleteRewardPot;

const getAllRewardPots = function (data, response, cb) {
	if (!cb) {
		cb = response;
	}
	
	
	let findData = {
		isActive: true
	};

	RewardPot.find(findData)
		.populate("createdBy" )
		.exec((err, res) => {
		if (err) {
			console.error(err);
			return cb(
				responseUtilities.responseStruct(
					500,
					null,
					"getAllRewardPots",
					null,
					data.req.signature
				)
			);
		}

		return cb(
			null,
			responseUtilities.responseStruct(
				200,
				"Reward Pot fetched Successfully",
				"getAllRewardPots",
				res,
				data.req.signature
			)
		);
	});
}
exports.getAllRewardPots = getAllRewardPots;

const getRewardPotsById = function (data, response, cb) {
	if (!cb) {
		cb = response;
	}

	if (!data.potId) {
		return cb(
			responseUtilities.responseStruct(
				400,
				"missing potId",
				"getRewardPotsById",
				null,
				data.req.signature
			)
		);
	}

	let findData = {
		_id: data.potId,
	};

	RewardPot.find(findData).populate("createdBy").exec((err, res) => {
		if (err) {
			console.error(err);
			return cb(
				responseUtilities.responseStruct(
					500,
					null,
					"getRewardPotsById",
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
				"Reward Pot fetched successfuly",
				"getRewardPotsById",
				res,
				data.req.signature
			)
		);
	});


}
exports.getRewardPotsById = getRewardPotsById;