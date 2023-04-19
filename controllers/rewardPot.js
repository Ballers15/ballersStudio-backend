const async = require("async");
const mongoose = require("mongoose");
const PotActionLogs = require("../models/potActionLogs");
const RewardPot = require("../models/rewardPot");
const userPotDetails = require("../models/userPotDetails");
const responseUtilities = require("../helpers/sendResponse");
const web3Service = require("../helpers/web3Service");


const getActivePot = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }
  if (!data.potType) {
    return cb(
      responseUtilities.responseStruct(
        400,
        null,
        "getActivePot",
        null,
        data.req.signature
      )
    );
  }

  let findData = {
    $and: [
      {
        $or: [
          { potStatus: process.env.POT_STATUS.split(",")[1] },
        ],
      },
      { isActive: true, potType: data.potType },
    ],
  };
  let projection = {
    startDate: 1,
    endDate: 1,
    claimExpiryDate: 1,
    assetType: 1,
    potStatus: 1,
    potType: 1,
  };
  RewardPot.find(findData, projection).exec((err, res) => {
    if (err) {
      console.log("RewardPot Error : ", err);
      return cb(
        responseUtilities.responseStruct(
          500,
          "Error in getting pot",
          "getActivePot",
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
        "Active Pot Fetched Successfuly",
        "getActivePot",
        res,
        data.req.signature
      )
    );
  });
};
exports.getActivePot = getActivePot;


const getRewardPotLeaderBoard = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  let waterFallFunctions = [];
  waterFallFunctions.push(async.apply(getActiveRewardPot, data));
  waterFallFunctions.push(async.apply(getRewardLeaderBoard, data));
  async.waterfall(waterFallFunctions, cb);
};
exports.getRewardPotLeaderBoard = getRewardPotLeaderBoard;


const getActiveRewardPot = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }
  let findData = {
    $and: [
      {
        $or: [
          { potStatus: process.env.POT_STATUS.split(",")[1] },
        ],
      },
      { isActive: true, 
        potType: process.env.REWARD_POT.split(",")[0] },
    ],
  };
 
  RewardPot.findOne(findData).exec((err, res) => {
    if (err) {
      console.log("getRewardPotLeaderBoard Error : ", err);
      return cb(
        responseUtilities.responseStruct(
          500,
          "Error in getting Active Reward Pot",
          "getActiveRewardPot",
          null,
          data.req.signature
        )
      );
    }
    console.log("Reward pot",findData,res);
    return cb(
      null,
      responseUtilities.responseStruct(
        200,
        "Active Pot Fetched Successfuly",
        "getActiveRewardPot",
        res,
        data.req.signature
      )
    );
  });
};

const getRewardLeaderBoard = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }


  console.log(response.data);

  if(!response.data?._id){
    return cb(
      null,
      responseUtilities.responseStruct(
        200,
        "Leaderboard Fetched Successfuly",
        "getRewardLeaderBoard",
        [],
        data.req.signature
      )
    );
  }

  let potId = response.data?._id;
  console.log(potId);
  let findData = { potId: potId };
  let projection={
    userId:1,
    walletAddress:1,
    nftHolded:1,
    rewardPoints:1,
    amount:1,
    rewardPointsPercentage:1
  };
  let searchQuery;

  if (data.search) {

    searchQuery = {
      "userName": { $regex: data.search, $options: "i" },
    };
  }

  userPotDetails
    .find(findData,projection)
    .populate({
      path: "userId",
      model: "users",
      match:searchQuery,
      select: "_id userName",
    })
    .sort({ rewardPointsPercentage: -1 })
    .exec((err, res) => {
      if (err) {
        console.log(err);
        console.log("RewardPot Error : ", err);
        return cb(
          responseUtilities.responseStruct(
            500,
            "Error in getting RewardPot",
            "getRewardLeaderBoard",
            null,
            data.req.signature
          )
        );
      }
      let finalRes=JSON.parse(JSON.stringify(res));
      let sendRes=[];
      finalRes.map((el)=>{
        console.log("el",el);
        if(el.userId==null){
          console.log("ap",el);
          //finalRes.splice(el,1);
        }else{
          sendRes.push(el);
                }
      })
      return cb(
        null,
        responseUtilities.responseStruct(
          200,
          "Reward Leaderboard Fetched Successfuly",
          "getRewardPotLeaderBoard",
          sendRes,
          data.req.signature
        )
      );
    });
};


const getLotteryPotLeaderBoard = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  let waterFallFunctions = [];
  waterFallFunctions.push(async.apply(getActiveLotteryPot, data));
  waterFallFunctions.push(async.apply(getLotteryleaderBoard, data));
  async.waterfall(waterFallFunctions, cb);
};
exports.getLotteryPotLeaderBoard = getLotteryPotLeaderBoard;


const getActiveLotteryPot = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }
  let findData = {
    $and: [
      {
        $or: [
          { potStatus: process.env.POT_STATUS.split(",")[1] },
        ],
      },
      { isActive: true, potType: process.env.REWARD_POT.split(",")[1] },
    ],
  };
  RewardPot.findOne(findData).exec((err, res) => {
    if (err) {
      console.log("getActiveLotteryPot Error : ", err);
      return cb(
        responseUtilities.responseStruct(
          500,
          "Error in getting fetching pot",
          "getActiveLotteryPot",
          null,
          data.req.signature
        )
      );
    }
    return cb(
      null,
      responseUtilities.responseStruct(
        200,
        "Active Pot Fetched Successfuly",
        "getActiveLotteryPot",
        res,
        data.req.signature
      )
    );
  });
};

const getLotteryleaderBoard = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }
  console.log(response.data);
  if(!response.data?._id){
    return cb(
      null,
      responseUtilities.responseStruct(
        200,
        "Active Pot Fetched Successfuly",
        "getRewardPotLeaderBoard",
        [],
        data.req.signature
      )
    );
  }
  let potId = response.data._id;
  let findData = { 
    potId: potId ,
  
  };
  let searchQuery;
  if (data.search) {

    searchQuery = {
      "userName": { $regex: data.search, $options: "i" },
    };
  }

  
 
  userPotDetails
    .find(findData)
    .populate({
      path: "userId",
      model: "users",
      match: searchQuery,
      select: "_id userName",
      
    })
    .sort({ amount: -1 })
    .exec((err, res) => {
      if (err) {
        console.log(err);
        console.log("RewardPot Error : ", err);
        return cb(
          responseUtilities.responseStruct(
            500,
            "Error in getting RewardPot",
            "getRewardLeaderBoard",
            null,
            data.req.signature
          )
        );
      }
      let finalRes=JSON.parse(JSON.stringify(res));
      let sendRes=[];

      finalRes.map((el)=>{
        console.log("el",el);
        if(el.userId==null){
          console.log("ap",el);
          // finalRes.splice(el,1);
        }else{
          sendRes.push(el);
                }
      })
      console.log("res", sendRes);
      return cb(
        null,
        responseUtilities.responseStruct(
          200,
          "Active Pot Fetched Successfuly",
          "getRewardPotLeaderBoard",
          sendRes,
          data.req.signature
        )
      );
    });
};




const getLotteryPotBoardPreviousRounds = function(data,response,cb){
  if(!cb){
    cb=response;
  }

  let waterFallFunctions = [];
  waterFallFunctions.push(async.apply(getPreviousRounds, data));
  waterFallFunctions.push(async.apply(getLotteryPotWalletAddress, data));
  async.waterfall(waterFallFunctions, cb);


}

exports.getLotteryPotBoardPreviousRounds = getLotteryPotBoardPreviousRounds;



const getPreviousRounds =function(data,response,cb){
  if(!cb){
    cb=response;
  }
  let pipeline=[
    {
      $match:{

        $and: [
          {
            $or: [
              { potStatus: "CLAIM"},
              { potStatus: "ARCHIVED" },
            ],
          },
          { isActive: true, 
            potType: process.env.REWARD_POT.split(",")[1] },
        ],
    }
  
   },
    {
      $lookup:{
        from:"userpotdetails",
        let:{"potId":"$_id"},
        pipeline:[{
            $match:{
                "$expr":{"$eq":["$potId","$$potId"]},"lotteryWon":true,
                
                }
            
            }],
        as :"potUserDetails"
    }
    },
    {$lookup:{
        from:"users",
        localField:"potUserDetails.userId",
        foreignField:"_id",
        as:"userDetails",
    }},
    { $sort:{"createdAt":-1} },
    
    {
        $project:{
          "createdAt":1,
          "startDate":1,
          "endDate":1,
          "claimExpiryDate":1,
            "potUserDetails.potId":1,
            "potUserDetails.userId":1,
            "potUserDetails.walletAddress":1,
            "userDetails.userName":1,
                      }
    },
    
    {$unwind:{path:"$userDetails",preserveNullAndEmptyArrays:true}
      },
      {$unwind:{path:"$potUserDetails",preserveNullAndEmptyArrays:true}
      }     
       
    ]
    RewardPot.aggregate(pipeline).exec((err,res)=>{
      if(err) {
        console.error(err);
        return cb(
          responseUtilities.responseStruct(
            500,
            "Error in fetching previous round",
            "getPreviousRounds",
            null,
            data.req.signature
          )
        );
      }
      console.log("res$$$$$$$$$$$$$$$$$$$$",res);
      return cb(
        null,
        responseUtilities.responseStruct(
          200,
          "Previous Round Fetched Successfuly",
          "getPreviousRounds",
          res,
          data.req.signature
        )
      );
    })
}

const getLotteryPotWalletAddress =function(data,response,cb){
  if(!cb){
    cb=response;
  }
  if(data.walletAddress){

  let finalRes=response.data;
  if(!finalRes.length){

      return cb(
        null,
        responseUtilities.responseStruct(
          200,
          "Previous Round Fetched Successfuly",
          "getLotteryPotWalletAddress",
          response.data,
          data.req.signature
        )
      ); 
    }

    let potId=finalRes[0].potUserDetails?.potId;
    let walletAddress=data.walletAddress;
    let findData={
      potId:potId,
      walletAddress:walletAddress
    }
    userPotDetails.findOne(findData).exec((err,res)=>{
      if(err){
        console.log(err);
        return cb(
          responseUtilities.responseStruct(
            500,
            "Error in Fetching previous Rounds ",
            "getLotteryPotWalletAddress",
            null,
            data.req.signature
          )
        );
      }
      let sendRes={};

      

      if(res){
        sendRes={
          participated:true,
          lotteryWon:res.lotteryWon,
          claimed:res.status=="COMPLETED"?true:false
        }
      
      }else{
        sendRes={
          participated:false,
          lotteryWon:false,

        }
      }

      let sendResponse=JSON.parse(JSON.stringify(finalRes));
      console.log("sendResponse",sendResponse)
      if(sendResponse.length){
        sendResponse[0].userRes=sendRes
      }
      
      return cb(
        null,
        responseUtilities.responseStruct(
          200,
          "Previous Round Fetched Successfuly",
          "getLotteryPotWalletAddress",
          sendResponse,
          data.req.signature
        )
      ); 

    })


  }
  else{
    return cb(
      null,
      responseUtilities.responseStruct(
        200,
        "Previous Round Fetched Successfuly",
        "getLotteryPotWalletAddress",
        response.data,
        data.req.signature
      )
    ); 
  
  }



}




const getRewardPotBoardPreviousRounds = function(data,response,cb) {
  if(!cb){
    cb=response;
  }


  let waterFallFunctions = [];
  waterFallFunctions.push(async.apply(getRewardPreviousRounds, data));
  waterFallFunctions.push(async.apply(getRewardPotWalletAddress, data));
  async.waterfall(waterFallFunctions, cb);
    
}
exports.getRewardPotBoardPreviousRounds = getRewardPotBoardPreviousRounds;

const getRewardPreviousRounds =function(data,response,cb){
  if(!cb){
    cb=response;
  }
  let pipeline=[
    {$match:{
            $and: [
              {
                $or: [
                  { potStatus: "CLAIM"},
                  { potStatus: "ARCHIVED" },
                ],
              },
              { isActive: true, 
                potType: "REWARDPOT" },
            ],
    
    }
    },
    {$lookup:{
        from:"userpotdetails",
        let: { "potId": "$_id" },
        pipeline:[
        {
        $match:{
            "$expr":{"$eq":["$potId","$$potId"]}
            }
        },
        {
              '$sort': {  'rewardPointsPercentage': -1 }
         },
         {
              '$limit': 3
            },
           {
               $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
              },
              { $unwind: "$user" },
              {$project:{
                  "user.role":0,
                  "user.accountId":0,
                  "user.password":0,
                  "user.salt":0,
                  "user.provider":0,
                  "user.emailVerified":0,
                  "user.isBlocked":0,
                  "user.isActive":0
                  }}
        ],
        as: "potUserDetails"
        
        },
        
    },
    {$sort:{"createdAt":-1}},
    {
      $project:{
          "potUserDetails.lotteryWon":0,
          "potAmountCollected":0,
          "claimPot":0,
          "isActive":0,
          "rewardTokenAmount":0,
          "assetDetails":0,
          "createdBy":0,
          "createdAt":0,
          "updatedAt":0,
          "potStatus":0
          }
        
        
    }
]
RewardPot.aggregate(pipeline).exec((err,res)=>{
  if(err) {
    console.error(err);
    return cb(
      responseUtilities.responseStruct(
        500,
        "Error in getting Previous Rounds",
        "getRewardPreviousRounds",
        null,
        data.req.signature
      )
    );
  }
  return cb(
    null,
    responseUtilities.responseStruct(
      200,
      "Previous Round Fetched Successfuly",
      "getRewardPreviousRounds",
      res,
      data.req.signature
    )
  );
})


}
const getRewardPotWalletAddress =function(data,response,cb){
  if(!cb){
    cb=response;
  }
  if(data.walletAddress){
  let finalRes=response.data;
    if(!finalRes.length){

      return cb(
        null,
        responseUtilities.responseStruct(
          200,
          "Previous Round Fetched Successfuly",
          "getRewardPotWalletAddress",
          response.data,
          data.req.signature
        )
      ); 
    }

    let potId=finalRes[0]?._id;
    
    let walletAddress=data.walletAddress;
    let findData={
      potId:potId,
      walletAddress:walletAddress
    }
    userPotDetails.findOne(findData).exec((err,res)=>{
      if(err){
        console.log(err);
        return cb(
          responseUtilities.responseStruct(
            500,
            "Error in getting pot details",
            "getRewardPreviousRounds",
            null,
            data.req.signature
          )
        );
      }
      let sendRes={};
      console.log("getRewardPotWalletAddress::res",res,findData);
      if(res){
        sendRes={
          participated:true,
          claimed:(res.status=="COMPLETED")?true:false
        }
      
      }else{
        sendRes={
          participated:false,
          claimed:false
        }
      }

      let sendResponse=JSON.parse(JSON.stringify(finalRes));
      console.log("sendResponse",sendResponse)
      if(sendResponse.length){
        sendResponse[0].userRes=sendRes
      }
      
      return cb(
        null,
        responseUtilities.responseStruct(
          200,
          "Previous rounds Successfuly",
          "getRewardPreviousRounds",
          sendResponse,
          data.req.signature
        )
      ); 

    })


  }
  else{
    return cb(
      null,
      responseUtilities.responseStruct(
        200,
        "Previous rounds Successfuly",
        "getRewardPreviousRounds",
        response.data,
        data.req.signature
      )
    ); 
  
  }

}











/******************************************************************ADMIN****************************************************************************************** */


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
  // TICKER is token id in nft and reward amount is quantity in nft

  let assetDetails = {
    contractAddress: data.assetDetails.contractAddress,
    assetName: data.assetDetails.assetName,
    ticker: data.assetDetails.ticker,
  };

  let insertData = {
    rewardTokenAmount: data.rewardTokenAmount,
    assetDetails: assetDetails,
    startDate: (data.startDate),
    endDate: (data.endDate),
    claimExpiryDate: (data.claimExpiryDate),
    assetType: data.assetType,
    potType: data.potType,
    potStatus: data.isActive
      ? process.env.POT_STATUS.split(",")[1]
      : process.env.POT_STATUS.split(",")[0],
    createdBy: data.req.auth.id,
  };

  console.log("inserD", insertData);
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
        res,
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
      action: `Pot Status Change to ${data.isActive ? "Active" : "Deactive"}`,
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
  // waterFallFunctions.push(async.apply(checkIfPotIsActive, data));
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

    if (res.potStatus == process.env.POT_STATUS.split(",")[1]) {
      return cb(
        responseUtilities.responseStruct(
          400,
          "Ongoing pot cant be updated",
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
    ticker: data.assetDetails.ticker,
  };

  let updateData = {
    rewardTokenAmount: data.rewardTokenAmount,
    assetDetails: assetDetails,
    startDate: (data.startDate),
    endDate: (data.endDate),
    assetType: data.assetType,
    claimExpiryDate: (data.claimExpiryDate),
    potType: data.potType,
    potStatus: data.isActive
      ? process.env.POT_STATUS.split(",")[1]
      : process.env.POT_STATUS.split(",")[0],
  };
  console.log("updateData", updateData);

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

const updateClaimOfRewardPot = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }
  if (!data.potId) {
    return cb(
      responseUtilities.responseStruct(
        400,
        "potId is required",
        "updateClaimOfRewardPot",
        null,
        data.req.signature
      )
    );
  }

  let waterFallFunctions = [];
  waterFallFunctions.push(async.apply(updateClaim, data));
  waterFallFunctions.push(async.apply(potActionLogs, data));
  async.waterfall(waterFallFunctions, cb);
};
exports.updateClaimOfRewardPot = updateClaimOfRewardPot;

const updateClaim = function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  let updateData = {
    claimPot: data.claim,
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
          "updateClaimOfRewardPot",
          null,
          data.req.signature
        )
      );
    }
    data.insertActionLogData = {
      potId: data.potId,
      addedBy: data.req.auth.id,
      action: "Admin stopped the claim of pot",
    };

    return cb(
      null,
      responseUtilities.responseStruct(
        200,
        "Claim of pot updated ",
        "updateClaim",
        res,
        data.req.signature
      )
    );
  });
};

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
  waterFallFunctions.push(async.apply(getUserCountInPots, data));
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
      $or: [
        { potStatus: process.env.POT_STATUS.split(",")[1] },
        { potStatus: process.env.POT_STATUS.split(",")[2] },
      ],
    };
  }

  if (data.archivedRewardPots) {
    findData = {
      potStatus: process.env.POT_STATUS.split(",")[3],
    };
  }
  if (data.upcomingPots) {
    let currentTime = new Date();

    findData = {
      potStatus: process.env.POT_STATUS.split(",")[0],
    };
  }

  if (data.potType) {
    findData.potType = data.potType;
  }

  let limit = parseInt(process.env.pageLimit);
  let skip = 0;
  if (data.currentPage) {
    skip = data.currentPage > 0 ? (data.currentPage - 1) * limit : 0;
  }
  console.log("find", findData);

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

      // return cb(
      //   null,
      //   responseUtilities.responseStruct(
      //     200,
      //     "Pots fetched Successfuly",
      //     "getAllRewardPots",
      //     res,
      //     null
      //   )
      // );

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
        console.log("count is", count);

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

const getPotCounts = async function (data, response, cb) {
  if (!cb) {
    cb = response;
  }

  let findDataActive = {
    $or: [
      { potStatus: process.env.POT_STATUS.split(",")[1] },
      { potStatus: process.env.POT_STATUS.split(",")[2] },
    ],
  };

  let activePots = await RewardPot.find(findDataActive);
  console.log(activePots.length);
  let currentTime = new Date();

  let findDataUpcoming = {
    potStatus: process.env.POT_STATUS.split(",")[0],
  };

  let upcomingPots = await RewardPot.find(findDataUpcoming);
  console.log("AAAA", upcomingPots);

  let findDataArchive = {
    potStatus: process.env.POT_STATUS.split(",")[3],
  };

  let archivePots = await RewardPot.find(findDataArchive);

  let sendRes = {
    activePots: activePots.length,
    upcomingPots: upcomingPots.length,
    archivePots: archivePots.length,
  };
  return cb(
    null,
    responseUtilities.responseStruct(
      200,
      "get pot counts",
      "getPotCounts",
      sendRes,
      data.req.signature
    )
  );
};

exports.getPotCounts = getPotCounts;

const checkNftClaimContract =async function(data,response,cb){
  if(!cb){
    cb=response;
  }
  if(!data.tokenId){
    return cb(
      responseUtilities.responseStruct(
        400,
        "Provide tokenId of NFT",
        "checkNftClaimContract",
        null,
        data.req.signature
      )
    )
  }
  let waterFallFunctions = [];
  waterFallFunctions.push(async.apply(web3Service.checkNftOnClaimContract, data));
  async.waterfall(waterFallFunctions, cb);


}
exports.checkNftClaimContract = checkNftClaimContract;
