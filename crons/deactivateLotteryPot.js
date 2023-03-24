require('../config/index');
require('../models/db');
const async = require("async");
const cron = require('node-cron');
const RewardPot = require("../models/rewardPot");
const userPotDetails = require("../models/userPotDetails");



let taskJob = cron.schedule('*/10 * * * * *', () => {   // runs at 12:00 mid night
    deactivateRewardPots()
});



let deactivateRewardPots = async (cb) => {
    var currentDate=new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    var currentTime = moment(currentDate).format('YYYY-MM-DD HH:mm:ss')
        console.log("currentTime",currentTime,currentDate);
    let findData = {
        isActive: true,
        "potStatus": "ONGOING",
        endDate: { $lte: currentTime },
        potType:"LOTTERYPOT"
    }

    RewardPot.find(findData).exec((err, res) => {
		if (err) {
			console.error(err);
        }
        let data = {
            rewardPotDetails:res
        };
        console.log("res",res);
        if(res.length){
            data.rewardPotIds = res.map((el) => el._id);
                let waterFallFunctions = [];
                waterFallFunctions.push(async.apply(UpdateRewardPotStatus, data));
                waterFallFunctions.push(async.apply(getUserDetailsFromPotId, data));
                waterFallFunctions.push(async.apply(selectLotteryWinner, data));
                waterFallFunctions.push(async.apply(updateUserDetails, data));
    
                async.waterfall(waterFallFunctions, cb);
        }else{
            console.log("No running pot found");
        }
	});
}

const UpdateRewardPotStatus = function (data, response, cb) {
    if (!cb) {
        cb = response;
    }
    
    let rewardPotIds = data.rewardPotIds;
    let findData = {
        _id: {$in:rewardPotIds}
    }
    let options = {
        multi:true
    }
   
    let updateDate = {
        potStatus:"CLAIM"
    }

    RewardPot.updateMany(findData,updateDate,options).exec((err, res) => {
        if (err) {
            console.error(err);
			
        } else {
            console.log(res);
            return cb(null)
        }
    })
}

const getUserDetailsFromPotId = function (data, response, cb) {
    if (!cb) {
		cb = response;
    }
    let rewardPotIds = data.rewardPotIds;

    let findData = {
        potId: { $in:rewardPotIds }
    }

    userPotDetails.find(findData).exec((err, res) => {
		if (err) {
			console.error(err);
        } else {
            data.userPotDetails = res;
            data.userPotDetailsIds = res.map((el) => el._id);
            return cb(null);
        }
	});
};

const selectLotteryWinner =function(data,response,cb){
    if(!cb){
        cb=response;
    }
    let winner;
    const cumulativeWeights = [];
    console.log("data.userPotDetails",data.userPotDetails);
    for (let i = 0; i < data.userPotDetails.length; i += 1) {
        cumulativeWeights[i] = data.userPotDetails[i].amount + (cumulativeWeights[i - 1] || 0);
    }
    const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
    const randomNumber = maxCumulativeWeight * Math.random();
    for (let itemIndex = 0; itemIndex < data.userPotDetails.length; itemIndex += 1) {
        if (cumulativeWeights[itemIndex] >= randomNumber) {
            winner=data.userPotDetails[itemIndex];
              break;
        }
      }
      data.winner=winner;
      console.log(winner);
      return cb(null);

}

const updateUserDetails = function(data,response,cb){
    if(!cb){
        cb=response;
    }
    let findData={
        potId:data.winner.potId,
        userId:data.winner.userId,
        walletAddress:data.winner.walletAddress
    }
    let updateData={
        lotteryWon:true
    }
    userPotDetails.findOneAndUpdate(findData,updateData).exec((err, res) => {
		if (err) {
			console.error(err);
        } else {
          console.log("updated the winner");
            return cb(null);
        }
	});
}