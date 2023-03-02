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
    var currentTime = new Date();
        console.log("currentTime",currentTime);
    let findData = {
        isActive: true,
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
        data.rewardPotIds = res.map((el) => el._id);

            let waterFallFunctions = [];
            waterFallFunctions.push(async.apply(UpdateRewardPotStatus, data));
            waterFallFunctions.push(async.apply(getUserDetailsFromPotId, data));
            waterFallFunctions.push(async.apply(selectLotteryWinner, data));
            waterFallFunctions.push(async.apply(updateUserDetails, data));

            async.waterfall(waterFallFunctions, cb);
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
        isActive:false
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
            data.userPotDetailsDetails = res;
            data.userPotDetailsIds = res.map((el) => el._id);
            return cb(null);
        }
        
       
	});
};