const async = require("async");
const mongoose = require("mongoose");
const RewardPot = require("../models/rewardPot");
const userPotDetails = require("../models/userPotDetails");
const responseUtilities = require("../helpers/sendResponse");
const web3Service = require("../helpers/web3Service");

const adduserPotDetails = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }
  // TODO://remove data.amount from here
  if (!data.walletAddress || !data.amount || !data.potId) {
    return cb(
      responseUtilities.responseStruct(
        400,
        null,
        "adduserPotDetails",
        null,
        data.req.signature
      )
    );
  }

  let waterFallFunctions = [];

  waterFallFunctions.push(async.apply(getPotDetails, data));
  waterFallFunctions.push(async.apply(checkBalanceSubmissionDate, data));
  waterFallFunctions.push(async.apply(checkWalletAssociatedToOther, data));
  waterFallFunctions.push(async.apply(checkPremiumPot, data));
  // waterFallFunctions.push(async.apply(getUserGameBalance, data));
  // waterFallFunctions.push(async.apply(updateUserGameBalance, data));

  waterFallFunctions.push(async.apply(addBalanceForUser, data));

  async.waterfall(waterFallFunctions, cb);
};
exports.adduserPotDetails = adduserPotDetails;

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
          "Pot details not found",
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

const checkWalletAssociatedToOther = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }
  console.log("data.req.auth.id", data.req.auth.id);
  let findData = {
    potId: data.potId,
    walletAddress: data.walletAddress,
  };
  userPotDetails.findOne(findData, (err, res) => {
    if (err) {
      console.log("checkWalletAssociatedToOther Error : ", err);
      return cb(
        responseUtilities.responseStruct(
          500,
          "Error in  checkWalletAssociatedToOther",
          "checkWalletAssociatedToOther",
          null,
          data.req.signature
        )
      );
    }
    if (res) {
      if (!res.userId.equals(data.req.auth.id)) {
        return cb(
          responseUtilities.responseStruct(
            400,
            "Wallet associated to other user for this pot",
            "checkWalletAssociatedToOther",
            null,
            data.req.signature
          )
        );
      }
    }
    return cb(
      null,
      responseUtilities.responseStruct(
        200,
        "No association found",
        "checkWalletAssociatedToOther",
        res,
        data.req.signature
      )
    );
  });
};

const checkPremiumPot = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }
  // data.potDetails
  if (data.potDetails.potType == "REWARDPOT") {
    let waterFallFunctions = [];

    waterFallFunctions.push(async.apply(web3Service.checkUserHoldsNft, data));
    async.waterfall(waterFallFunctions, cb);
  } else {
    return cb(
      null,
      responseUtilities.responseStruct(
        200,
        "check Premium Pot",
        "checkPremiumPot",
        null,
        data.req.signature
      )
    );
  }
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

  let currentDate = new Date();
  console.log("currentDate", currentDate);
  console.log(data.potDetails.startDate);
  console.log(data.potDetails.endDate);
  //check for is pot active or closed

  if (!data.potDetails.isActive) {
    return cb(
      responseUtilities.responseStruct(
        400,
        "Submission for  pot is not allowed for this moment pot is closed",
        "checkBalanceSubmissionDate",
        null,
        data.req.signature
      )
    );
  }

  if (
    data.potDetails.startDate < currentDate &&
    currentDate <= data.potDetails.endDate
  ) {
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
        "Submission for  pot is not allowed for this moment",
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
    potId: data.potId,
    walletAddress: data.walletAddress,
    userId: data.req.auth.id,
  };
  console.log("find", findData);

  let updateData = {
    $inc: { amount: data.amount },
  };

  let options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  };
  userPotDetails.findOneAndUpdate(findData, updateData, options, (err, res) => {
    if (err) {
      console.log("userPotDetails Error : ", err);
      return cb(
        responseUtilities.responseStruct(
          500,
          "Error in creating userPotDetails",
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

//not in use
const updateLotterNumber = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  if (!data.walletAddress || !data.potId || !data.lotteryNumbers) {
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
};
exports.updateLotterNumber = updateLotterNumber;

//not in use
const addLotterNumber = async function (data, response, cb) {
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
    potId: data.potId,
    walletAddress: data.walletAddress,
    userId: data.req.auth.id,
  };

  let options = {
    upsert: true,
  };

  let updateData = {
    $addToSet: { lotteryNumbers: { $each: data.lotteryNumbers } },
  };

  userPotDetails.findOneAndUpdate(findData, updateData, options, (err, res) => {
    if (err) {
      console.log("userPotDetails Error : ", err);
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

const getAlluserPotDetails = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  userPotDetails
    .find()
    .populate("userId potId")
    .exec((err, res) => {
      if (err) {
        console.error(err);
        return cb(
          responseUtilities.responseStruct(
            500,
            null,
            "getAlluserPotDetails",
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
          "getAlluserPotDetails",
          res,
          data.req.signature
        )
      );
    });
};
exports.getAlluserPotDetails = getAlluserPotDetails;

const getuserPotDetailsById = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  if (!data.balanceId) {
    return cb(
      responseUtilities.responseStruct(
        400,
        "missing balanceId",
        "getuserPotDetailsById",
        null,
        data.req.signature
      )
    );
  }

  let findData = {
    _id: data.balanceId,
  };

  userPotDetails
    .find(findData)
    .populate("potId")
    .exec((err, res) => {
      if (err) {
        console.error(err);
        return cb(
          responseUtilities.responseStruct(
            500,
            null,
            "getuserPotDetailsById",
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
          "getuserPotDetailsById",
          res,
          data.req.signature
        )
      );
    });
};
exports.getuserPotDetailsById = getuserPotDetailsById;



const addLotteryPotBalance = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  if (!data.walletAddress || !data.potId) {
    return cb(
      responseUtilities.responseStruct(
        400,
        null,
        "addLotteryPotBalance",
        null,
        data.req.signature
      )
    );
  }

  let waterFallFunctions = [];
  waterFallFunctions.push(async.apply(getPotDetails, data));
  waterFallFunctions.push(async.apply(checkBalanceSubmissionDate, data));

  waterFallFunctions.push(async.apply(checkWalletAssociatedToOther, data));
  // waterFallFunctions.push(async.apply(getUserGameBalance, data));
  //add data.amount from here
  // waterFallFunctions.push(async.apply(updateUserGameBalance, data));
  waterFallFunctions.push(async.apply(addBalanceForUser, data));

  async.waterfall(waterFallFunctions, cb);
};
exports.addLotteryPotBalance = addLotteryPotBalance;

const createClaimWithdrawl = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  if (!data.potId || !data.walletAddress) {
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
  waterFallFunctions.push(async.apply(getPotDetails, data));
  waterFallFunctions.push(async.apply(checkClaimExpired, data));
  waterFallFunctions.push(async.apply(checkIfuserPotDetailsExist, data));
  waterFallFunctions.push(async.apply(checkIfSignatureExist, data));
  waterFallFunctions.push(async.apply(getLatestNonce, data));
  waterFallFunctions.push(async.apply(web3Service.createUserSignature, data));
  waterFallFunctions.push(async.apply(initiateWithdrawl, data));
  async.waterfall(waterFallFunctions, cb);
};

exports.createClaimWithdrawl = createClaimWithdrawl;

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

  let currentDate = new Date();
  console.log(currentDate);
  console.log(data.potDetails.startDate);
  console.log(data.potDetails.endDate);

  if (!data.potDetails.claimPot) {
    return cb(
      responseUtilities.responseStruct(
        400,
        "Claim is stopped for this pool",
        "checkClaimExpired",
        null,
        data.req.signature
      )
    );
  }

  if (
    data.potDetails.endDate < currentDate &&
    currentDate <= data.potDetails.claimExpiryDate
  ) {
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

const checkIfuserPotDetailsExist = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }
  console.log(data.req.auth.id);
  let findData = {
    potId: data.potId,
    userId: data.req.auth.id,
    walletAddress: data.walletAddress,
    // rewardClaimed:false
  };
  console.log("wallet", findData);
  userPotDetails.findOne(findData).exec((err, res) => {
    if (err) {
      console.log("checkIfuserPotDetailsExist", err);

      return cb(
        responseUtilities.responseStruct(
          500,
          "Error in creating Withdrawl",
          "checkIfuserPotDetailsExist",
          null,
          data.req.signature
        )
      );
    }
    console.log(res);

    let userBal = 0;
    let nftCount = 0;

    //check if only nft has weightage

    if (res) {
      userBal = res.amount;
      nftCount = res.nftHolded;
      data.amount = res.amount;
    }

    if (userBal > 0 && nftCount > 0) {
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
        "No balance exist for the logined user with this wallet address and no nft found in the wallet",
        "checkIfuserPotDetailsExist",
        null,
        data.req.signature
      )
    );
  });
};

const checkIfSignatureExist = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  let findData = {
    potId: data.potId,
    walletAddress: data.walletAddress,
    userId: data.req.auth.id,
  };
  userPotDetails.findOne(findData).exec((err, res) => {
    if (err) {
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
    // console.log(res);
    data.signatureExist = false;
    if (res) {
      if (res.signature) {
        data.signatureExist = true;
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
  });
};

const getLatestNonce = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  if (data.signatureExist) {
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

  userPotDetails
    .find()
    .sort({ createdAt: -1 })
    .exec((err, res) => {
      if (err) {
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
      let latest = 0;

      nonceResponse.filter((el) => {
        if (el.nonce > latest) {
          latest = el.nonce;
        }
      });
      latest = parseFloat(latest);
      console.log("nonce", latest + 1);
      data.nonce = latest + 1;
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
};

const initiateWithdrawl = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  if (data.signatureExist) {
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
  console.log("resonse", response.data);

  let findData = {
    potId: data.potId,
    walletAddress: data.walletAddress,
    userId: data.req.auth.id,
  };
  console.log(data.nonce);

  let updateData = {
    signature: signature,
    nonce: data.nonce,
  };

  let options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  };
  console.log("findData", findData, updateData, options);
  userPotDetails
    .findOneAndUpdate(findData, updateData, options)
    .exec((err, res) => {
      if (err) {
        console.log("err", err);
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
    });
};

///////////////////////////////////

const updateWithdrawl = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  if (
    !data.potId ||
    !data.walletAddress ||
    !data.txnHash ||
    !data.withdrawlId
  ) {
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
  waterFallFunctions.push(async.apply(findIfTransactionExist, data));
  waterFallFunctions.push(async.apply(web3Service.getTransactionStatus, data));
  waterFallFunctions.push(async.apply(updateTransactionDetails, data));
  async.waterfall(waterFallFunctions, cb);
};
exports.updateWithdrawl = updateWithdrawl;

const updateTransactionDetails = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }
  let transactionStatus = response.data;

  console.log(
    "transactionStatus",
    transactionStatus,
    data.txnHash,
    data.req.auth.id
  );

  let findData = {
    _id: data.withdrawlId,
    potId: data.potId,
    walletAddress: data.walletAddress,
    userId: data.req.auth.id,
  };

  let updateData = {
    hash: data.txnHash,
    status: transactionStatus.status,
    rewardClaimed: transactionStatus.status == "COMPLETED" ? true : false,
  };

  userPotDetails.findOneAndUpdate(findData, updateData).exec((err, res) => {
    if (err) {
      console.log("err", err);
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
    console.log("res", res);
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
  });
};

const createLotteryClaim = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  if (!data.potId || !data.walletAddress) {
    return cb(
      responseUtilities.responseStruct(
        400,
        null,
        "createLotteryClaim",
        null,
        data.req.signature
      )
    );
  }

  let waterFallFunctions = [];
  waterFallFunctions.push(async.apply(getPotDetails, data));
  waterFallFunctions.push(async.apply(checkClaimExpired, data));
  waterFallFunctions.push(async.apply(checkIfuserWonLottery, data));
  waterFallFunctions.push(async.apply(checkIfSignatureExist, data));
  waterFallFunctions.push(async.apply(getLatestNonce, data));
  waterFallFunctions.push(
    async.apply(web3Service.createLotterySignature, data)
  );
  waterFallFunctions.push(async.apply(initiateWithdrawl, data));
  async.waterfall(waterFallFunctions, cb);
};
exports.createLotteryClaim = createLotteryClaim;

const checkIfuserWonLottery = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  console.log(data.req.auth.id);
  let findData = {
    potId: data.potId,
    userId: data.req.auth.id,
    walletAddress: data.walletAddress,
    lotteryWon: true,
    rewardClaimed: false,
  };
  console.log("findData", findData);
  userPotDetails.findOne(findData).exec((err, res) => {
    if (err) {
      console.log("checkIfuserWonLottery", err);

      return cb(
        responseUtilities.responseStruct(
          500,
          "Error in creating Withdrawl",
          "checkIfuserWonLottery",
          null,
          data.req.signature
        )
      );
    }
    console.log("RES IS", res);
    if (res) {
      return cb(
        null,
        responseUtilities.responseStruct(
          200,
          "Withdrawls fetched Successfully",
          "checkIfuserWonLottery",
          res,
          data.req.signature
        )
      );
    }

    return cb(
      responseUtilities.responseStruct(
        400,
        "The user has not won the lottery",
        "checkIfuserPotDetailsExist",
        null,
        data.req.signature
      )
    );
  });
};

const updateLotteryWithdrawl = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }
  if (
    !data.potId ||
    !data.walletAddress ||
    !data.txnHash ||
    !data.withdrawlId
  ) {
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
  waterFallFunctions.push(async.apply(findIfTransactionExist, data));
  waterFallFunctions.push(async.apply(web3Service.getTransactionStatus, data));
  waterFallFunctions.push(async.apply(updateTransactionDetails, data));
  async.waterfall(waterFallFunctions, cb);
};
exports.updateLotteryWithdrawl = updateLotteryWithdrawl;

const findIfTransactionExist = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  console.log("transactionStatus", data.txnHash, data.req.auth.id);

  let findData = {
    _id: data.withdrawlId,
    potId: data.potId,
    walletAddress: data.walletAddress,
    userId: data.req.auth.id,
  };

  userPotDetails.findOne(findData).exec((err, res) => {
    if (err) {
      console.log("err", err);
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
    console.log("res", res);
    if (res) {
      return cb(
        null,
        responseUtilities.responseStruct(
          200,
          "updated Successfully",
          "updateTransactionDetails",
          null,
          data.req.signature
        )
      );
    }

    return cb(
      responseUtilities.responseStruct(
        400,
        "Details mismatched",
        "findIfTransactionExist",
        null,
        data.req.signature
      )
    );
  });
};

const getSpecificPotUsers = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }
  if (!data.potId) {
    return cb(
      responseUtilities.responseStruct(
        400,
        "Missing Params",
        "getSpecificPotUsers",
        null,
        data.req.signature
      )
    );
  }
  let limit = parseInt(process.env.pageLimit);

  let skip = 0;

  if (data.currentPage) {
    skip = data.currentPage > 0 ? (data.currentPage - 1) * limit : 0;
  }

  let findData = {
    potId: mongoose.Types.ObjectId(data.potId),
  };

  if (data.walletSearch) {
    findData.walletAddress = data.walletSearch;
  }

  let findUserQuery = {};

  if (data.email) {
    findUserQuery["userDetails.email"] = data.email;
  }

  if (data.name) {
    findUserQuery["userDetails"].name = data.name;
  }

  let sort = { createdAt: -1 };

  let pipeline = [
    {
      $match: findData,
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: findUserQuery,
    },
    {
      $project: {
        signature: 0,
        nonce: 0,
        "userDetails.accountId": 0,
        "userDetails.password": 0,
        "userDetails.salt": 0,
      },
    },
    { $sort: sort },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    },
  ];

  userPotDetails.aggregate(pipeline).exec((err, res) => {
    if (err) {
      console.log("error", err);
      return cb(
        responseUtilities.responseStruct(
          500,
          "Error in getting users",
          "getSpecificPotUsers",
          null,
          data.req.signature
        )
      );
    }
    let sendRes = {
      transactions: [],
      count: 0,
      pageLimit: limit,
    };
    if (res[0].metadata[0]) {
      let count = res[0].metadata[0].total;
      sendRes = {
        transactions: res[0].data,
        count: count,
        pageLimit: limit,
      };
    }
    return cb(
      null,
      responseUtilities.responseStruct(
        200,
        "Users fetched successfully",
        "getSpecificPotUsers",
        sendRes,
        null
      )
    );
  });
};
exports.getSpecificPotUsers = getSpecificPotUsers;
