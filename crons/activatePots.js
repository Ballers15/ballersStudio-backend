require('../config/index');
require('../models/db');
const cron = require('node-cron');
const moment = require('moment');
const RewardPot = require("../models/rewardPot");
// '*/10 * * * * *'                      10 sec
let taskJob = cron.schedule('*/10 * * * * *', () => { // runs at 12:00 mid night
    activateRewardPots()
});

let activateRewardPots = async () => {
  
    var currentTime = new Date();
    

    let findDate = {
        isActive:true,
        potStatus:"UPCOMING",
        startDate: {$lte:currentTime},
        endDate:{$gte:currentTime}
    }
    let  options   = {
        multi:true
    }
    let updateData = { "$set": { "potStatus": "ONGOING" } };
    console.log("findData",findDate);
    let rewardPot = await RewardPot.updateMany(findDate, updateData, options);
    console.log(rewardPot,'-------------------------------->>>>>>>>>>>>-------------->>>>>>>>>>>>>>>>>>>>>>>>>>')
    // console.log(rewardPotdata,'-------------------------------->>>>>>>>>>>>-------------->>>>>>>>>>>>>>>>>>>>>>>>>>')
}