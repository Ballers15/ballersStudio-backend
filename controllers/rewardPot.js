const async = require("async");
const mongoose = require("mongoose");
const PotActionLogs = require("../models/potActionLogs");
const RewardPot = require("../models/rewardPot");
const userPotDetails = require("../models/userPotDetails");
const responseUtilities = require("../helpers/sendResponse");
const createRewardPot = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  if (
    !data.rewardTokenAmount ||
    !data.assetDetails.contractAddress ||
    !data.startDate ||
    !data.endDate ||
    !data.assetType ||
    !data.potType ||
    !data.claimExpiryDate
  ) {
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

  let assetDetails = {
    contractAddress: data.assetDetails.contractAddress,
    assetName: data.assetDetails.assetName,
  };

  if (data.assetType == "NFT") {
    assetDetails.tokenId = data.assetDetails.tokenId;
  }
  if (data.assetType == "TOKEN") {
    assetDetails.ticker = data.assetDetails.ticker;
  }

  let insertData = {
    rewardTokenAmount: data.rewardTokenAmount,
    assetDetails: assetDetails,
    startDate: data.startDate,
    endDate: data.endDate,
    claimExpiryDate: data.claimExpiryDate,
    isActive: data.isActive || false,
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
      action: "Added new config details", // in case of edit "Edit the config details"
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
};

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
          "potActionLogs",
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
        "potActionLogs",
        null,
        data.req.signature
      )
    );
  });
};

const updateRewardPotStatus = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }
  if (!data.potId) {
    return cb(
      responseUtilities.responseStruct(
        400,
        null,
        "updateRewardPotStatus",
        null,
        data.req.signature
      )
    );
  }

  let waterFallFunctions = [];
  waterFallFunctions.push(async.apply(updatePotStatus, data));
  waterFallFunctions.push(async.apply(potActionLogs, data));
  async.waterfall(waterFallFunctions, cb);
};
exports.updateRewardPotStatus = updateRewardPotStatus;

const updatePotStatus = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  let updateData = {
    isActive: data.isActive,
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
          "updatePotStatus",
          null,
          data.req.signature
        )
      );
    }

    data.insertActionLogData = {
      potId: res._id,
      addedBy: data.req.auth.id,
      action: "Pot Status Change",
    };

    return cb(
      null,
      responseUtilities.responseStruct(
        200,
        "Pot status updated succesfully",
        "updatePotStatus",
        null,
        data.req.signature
      )
    );
  });
};

const updateRewardPot = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  if (
    !data.potId ||
    !data.rewardTokenAmount ||
    !data.assetDetails.contractAddress ||
    !data.startDate ||
    !data.endDate ||
    !data.assetType ||
    !data.potType
  ) {
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
  waterFallFunctions.push(async.apply(checkIfPotIsActive, data));
  waterFallFunctions.push(async.apply(updatePot, data));
  waterFallFunctions.push(async.apply(potActionLogs, data));
  async.waterfall(waterFallFunctions, cb);
};
exports.updateRewardPot = updateRewardPot;

const checkIfPotIsActive = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }
  let findData = {
    _id: data.potId,
  };
  RewardPot.findOne(findData, (err, res) => {
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

    if (res.isActive) {
      return cb(
        responseUtilities.responseStruct(
          400,
          "Active pot cant be updated",
          "updatePot",
          null,
          data.req.signature
        )
      );
    }

    return cb(
      null,
      responseUtilities.responseStruct(
        200,
        "Pot updated succesfully",
        "checkIfPotIsActive",
        null,
        data.req.signature
      )
    );
  });
};
const updatePot = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }
  let assetDetails = {
    contractAddress: data.assetDetails.contractAddress,
    assetName: data.assetDetails.assetName,
  };

  if (data.assetType == "NFT") {
    assetDetails.tokenId = data.assetDetails.tokenId;
  }
  if (data.assetType == "TOKEN") {
    assetDetails.ticker = data.assetDetails.ticker;
  }

  let updateData = {
    rewardTokenAmount: data.rewardTokenAmount,
    assetDetails: assetDetails,
    startDate: data.startDate,
    endDate: data.endDate,
    assetType: data.assetType,
    claimExpiryDate: data.claimExpiryDate,
    potType: data.potType,
    isActive: data.isActive || false,
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
      addedBy: data.req.auth.id,
      action: "Edit the config details",
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
};

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
    isActive: false,
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
};
exports.deleteRewardPot = deleteRewardPot;

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

  RewardPot.find(findData)
    .populate("createdBy")
    .exec((err, res) => {
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
};
exports.getRewardPotsById = getRewardPotsById;

const getAllRewardPots = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  data.activeRewardPots = true;

  let waterFallFunctions = [];
  waterFallFunctions.push(async.apply(getRewardPots, data));
  // waterFallFunctions.push(async.apply(getUserCountInPots, data));
  async.waterfall(waterFallFunctions, cb);
};
exports.getAllRewardPots = getAllRewardPots;

const getRewardPots = function (data, resonse, cb) {
  if (!cb) {
    cb = resonse;
  }
  let findData = {};
  if (data.activeRewardPots) {
    findData = {
      isActive: true,
    };
  }

  if (data.archivedRewardPots) {
    findData = {
      isActive: false,
    };
  }
  if (data.upcomingPots) {
    let currentTime = new Date();

    findData = {
      startDate: { $gte: currentTime },
    };
  }

  let limit = parseInt(process.env.pageLimit);
  let skip = 0;
  if (data.currentPage) {
    skip = data.currentPage > 0 ? (data.currentPage - 1) * limit : 0;
  }

  RewardPot.find(findData)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
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
          "Pots fetched Successfuly",
          "getAllRewardPots",
          res,
          null
        )
      );

      RewardPot.countDocuments(findData, (err, count) => {
        if (err) {
          console.error(err);
          return cb(
            responseUtilities.responseStruct(
              500,
              null,
              "getAllRewardPots",
              null,
              null
            )
          );
        }

        return cb(
          null,
          responseUtilities.responseStruct(
            200,
            "Pots fetched Successfuly",
            "getAllRewardPots",
            { res: res, count: count, pageLimit: limit },
            null
          )
        );
      });
    });
};

const getUserCountInPots = async function (data, response, cb) {
  if (!cb) {
    cb = response;
  }
  let rewardPots = response.data;

  let rewardPotsId = rewardPots.res;
  let potIds = rewardPotsId.map((el) => {
    return el._id;
  });
  console.log("potIds", potIds);

  let userDetails = [];
  for (let i in potIds) {
    let userCount = await userPotDetails.find({ potId: potIds[i] });
    let obj = {
      potId: potIds[i],
      count: userCount.length,
    };
    userDetails.push(obj);
  }
  let finalResponse = JSON.parse(JSON.stringify(response.data));
  finalResponse.res.map((el) => {
    let temp = userDetails.find((element) => element.potId == el._id);
    if (temp) {
      el.userCount = temp.count;
    }
  });

  return cb(
    null,
    responseUtilities.responseStruct(
      200,
      "Pots fetched Successfuly",
      "getAllRewardPots",
      finalResponse,
      null
    )
  );
};

const getArchivePots = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }
  data.archivedRewardPots = true;
  let waterFallFunctions = [];
  waterFallFunctions.push(async.apply(getRewardPots, data));
  waterFallFunctions.push(async.apply(getUserCountInPots, data));
  async.waterfall(waterFallFunctions, cb);
};
exports.getArchivePots = getArchivePots;

const getUpcomingRewardPots = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }
  data.upcomingPots = true;
  let waterFallFunctions = [];
  waterFallFunctions.push(async.apply(getRewardPots, data));
  waterFallFunctions.push(async.apply(getUserCountInPots, data));
  async.waterfall(waterFallFunctions, cb);
};
exports.getUpcomingRewardPots = getUpcomingRewardPots;
