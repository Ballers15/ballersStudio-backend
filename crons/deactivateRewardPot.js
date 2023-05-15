require('../config/index');
require('../models/db');
const async = require("async");
const cron = require('node-cron');
const RewardPot = require("../models/rewardPot");
const userPotDetails = require("../models/userPotDetails");
const NftBalance = require('../helpers/web3Service');
const moment = require('moment');
const helper=require('../controllers/userPotDetails');
//      0 0 * * *                     10 sec
let taskJob = cron.schedule('*/10 * * * * *', () => {   // runs at 12:00 mid night
    activateRewardPots()
});


let activateRewardPots = async (cb) => {



    var currentTime = new Date();
    let findData = {
        isActive:true,
        "potStatus": "ONGOING",
        endDate: { $lte: currentTime },
        potType:"REWARDPOT"
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
                waterFallFunctions.push(async.apply(helper.getUserDetailsFromPotId, data));
                waterFallFunctions.push(async.apply(helper.fetchBalanceFromOpensea, data));
                waterFallFunctions.push(async.apply(helper.updateNftBalanceInUserSchema, data));
                waterFallFunctions.push(async.apply(helper.getRewardTokenBalance, data));
                waterFallFunctions.push(async.apply(helper.updateRewardTokenBalance, data));    
                waterFallFunctions.push(async.apply(helper.updateRewardPotNotifications, data));    

                async.waterfall(waterFallFunctions, cb);
        }else{
            console.log("No Active reward pot found");
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
            data.userPotDetailsDetails = res;
            data.userPotDetailsIds = res.map((el) => el._id);
            return cb(null);
        }
        
       
	});
};

const fetchBalanceFromOpensea = async function (data, response, cb) {
    if (!cb) {
		cb = response;
    }
    let balanceFetchedFromOpensea = await NftBalance.getuserNftBalance(data);
    console.log("ENDEDD");
    data.balanceFetchedFromOpensea = balanceFetchedFromOpensea;
    return cb(null);
};


const updateNftBalanceInUserSchema = async function (data, response, cb) {
    if (!cb) {
		cb = response;
    }
    // console.log(data, '----------------------------------------------data from line 103 -----------------------------------------');
    let balanceFetchedFromOpensea = data.balanceFetchedFromOpensea;


    for(let i in balanceFetchedFromOpensea){
        let findData = {
            _id:balanceFetchedFromOpensea[i].userPotDetailsId
        }

        let updateDate = {
            nftHolded: balanceFetchedFromOpensea[i].nftHolded,
            rewardPointsPercentage: balanceFetchedFromOpensea[i].rewardPointsPercentage,
        }

        userPotDetails.findOneAndUpdate(findData,updateDate).exec((err, res) => {
            if (err) {
                console.error(err);
                
            } else {
                // console.log('---------------all data updated--------------------------------------');
                // return cb(null)
            }
        })
        console.log("asssssssssssssssss",i);
        if(i==balanceFetchedFromOpensea.length-1){
            return cb(null);
        }
    }



    
};



const getRewardTokenBalance =function(data,response,cb){
    
    if(!cb){
        cb=response;
    }
    console.log("getRewardTokenBalance");


    let rewardPotIds = data.rewardPotIds;

    console.log("rewardPotIds",rewardPotIds);

    let findData = {
        potId: { $in:rewardPotIds }
    }
    console.log("rewardPotIds",rewardPotIds);

    userPotDetails.find(findData).populate("potId").exec((err, res) => {
		if (err) {
			console.error(err);
        } else {

                console.log("res",res);

            data.updatedUserDetails=res;
            return cb(null);
        }
        
       
	});












}
const getTokenPrice=()=>{
    return 1;
}

const updateRewardTokenBalance =async function(data,response,cb){

    if(!cb){
        cb=response;
    }
    let updatedUserDetails=data.updatedUserDetails;
    let tokenPrice= getTokenPrice();
    console.log("updatedUserDetails",updatedUserDetails);
    for(let i in updatedUserDetails){
        let findData = {
            _id:updatedUserDetails[i]._id
        }

        console.log("A",updatedUserDetails[i].rewardPointsPercentage,updatedUserDetails[i].potId.rewardTokenAmount)
        let updateDate = {
            rewardedTokenAmount: (((updatedUserDetails[i].rewardPointsPercentage)/100)*updatedUserDetails[i].potId.rewardTokenAmount)/tokenPrice,
        }
console.log(updateDate,findData);
        userPotDetails.findOneAndUpdate(findData,updateDate).exec((err, res) => {
            if (err) {
                console.error(err);
                
            } else {
                console.log('---------------all data updated--------------------------------------');
                // return cb(null)
            }
        })

        if(i==updatedUserDetails.length-1){
            return cb(null);
        }
        console.log("last waterfall executed",i);
        
    }


}






const updateRewardPotDetails=function(data,response,cb){
    if(!cb){
        cb=response;
    }
    let waterFallFunctions = [];

    waterFallFunctions.push(async.apply(getUserDetailsFromPotId, data));
    waterFallFunctions.push(async.apply(fetchBalanceFromOpensea, data));
    waterFallFunctions.push(async.apply(updateNftBalanceInUserSchema, data));
    waterFallFunctions.push(async.apply(getRewardTokenBalance, data));
    waterFallFunctions.push(async.apply(updateRewardTokenBalance, data));   
    async.waterfall(waterFallFunctions, cb);

}




