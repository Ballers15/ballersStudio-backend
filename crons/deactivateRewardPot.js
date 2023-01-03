require('../config/index');
require('../models/db');
const async = require("async");
const cron = require('node-cron');
const RewardPot = require("../models/rewardPot");
const UserBalance = require("../models/userBalance");
const NftBalance = require('../helpers/web3Service');
//      0 0 * * *                     10 sec
let taskJob = cron.schedule('*/10 * * * * *', () => {   // runs at 12:00 mid night
    activateRewardPots()
});

let activateRewardPots = async (cb) => {
    var currentTime = new Date();
    
    let findData = {
        isActive: true,
        endDate: { $lte: currentTime }
    }

    RewardPot.find(findData).exec((err, res) => {
		if (err) {
			console.error(err);
        }
        let data = {
            rewardPotDetails:res
        };
        data.rewardPotIds = res.map((el) => el._id);

            let waterFallFunctions = [];
            waterFallFunctions.push(async.apply(UpdateRewardPotStatus, data));
            waterFallFunctions.push(async.apply(getUserDetailsFromPotId, data));
            waterFallFunctions.push(async.apply(fetchBalanceFromOpensea, data));
            waterFallFunctions.push(async.apply(updateNftBalanceInUserSchema, data));
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

    UserBalance.find(findData).exec((err, res) => {
		if (err) {
			console.error(err);
        } else {
            data.userBalanceDetails = res;
            data.userBalanceIds = res.map((el) => el._id);
            return cb(null);
        }
        
       
	});
};

const fetchBalanceFromOpensea = async function (data, response, cb) {
    if (!cb) {
		cb = response;
    }
    let balanceFetchedFromOpensea = await NftBalance.getuserNftBalance(data);
    data.balanceFetchedFromOpensea = balanceFetchedFromOpensea;
    return cb(null);
};


const updateNftBalanceInUserSchema = async function (data, response, cb) {
    if (!cb) {
		cb = response;
    }
    console.log(data, '----------------------------------------------data from line 103 -----------------------------------------');
    let balanceFetchedFromOpensea = data.balanceFetchedFromOpensea;
    balanceFetchedFromOpensea.forEach(el => {
        let findData = {
            _id:el.userBalanceId
        }
        let updateDate = {
            nftHolded: el.nftHolded,
            rewardedTokenAmount: el.rewardedTokenAmount,
            rewardPoints: el.rewardPoints,
            rewardClaimed:el.rewardClaimed
        }

        UserBalance.findOneAndUpdate(findData,updateDate).exec((err, res) => {
            if (err) {
                console.error(err);
                
            } else {
                console.log('---------------all data updated--------------------------------------');
                // return cb(null)
            }
        })
    });
};

