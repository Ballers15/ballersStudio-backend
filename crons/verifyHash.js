require('../config/index');
require('../models/db');
const cron = require('node-cron');
const moment = require('moment');
const RewardPot = require("../models/rewardPot");
const userPotDetails = require("../models/userPotDetails");
const web3Service = require('../helpers/web3Service');

// '*/10 * * * * *'                      10 sec
let taskJob = cron.schedule('*/10 * * * * *', () => { // runs at 12:00 mid night
    verifyHashes()
});


let verifyHashes = async () => {
  
    

    let findData = {
        hash:{$exists: true},
        rewardClaimed:false,
    }
    console.log("findData",findData);
    let rewardPot = await userPotDetails.find(findData);
console.log("rewardPot",rewardPot);
    if(rewardPot.length){
        for(let i in rewardPot){
            let sendData={};
            sendData["txnHash"]=rewardPot[i].hash;
            let transactionStatus =await web3Service.getTransactionReceit(sendData);
            let updateData = { 
            status: transactionStatus.status,
            rewardClaimed: transactionStatus.status == "COMPLETED" ? true : false,    
            };
            let updatedData= await userPotDetails.findOneAndUpdate(findData,updateData);
            console.log(updatedData);
        }
    }
    else{
        console.log("not found");
    }
}

