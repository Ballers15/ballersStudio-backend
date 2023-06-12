require('../config/index');
require('../models/db');
const cron = require('node-cron');
const RewardPot = require("../models/rewardPot");
const moment = require('moment');

// '*/10 * * * * *'                      10 sec
// '0 0 * * *'
let taskJob = cron.schedule('*/10 * * * * *', () => { // runs at 12:00 mid night
    deactivateClaims()
});

let deactivateClaims = async () => {
    var currentTime = new Date();
    let findDate = {
        isActive:true,
        potStatus:"CLAIM",
        claimExpiryDate: {$lte:currentTime}
    }

    let  options   = {
        multi:true
    }
    let updateData = { "$set": { 
        "claimPot": false ,
        "potStatus":"ARCHIVED"   
} };

    let rewardPot = await RewardPot.updateMany(findDate, updateData, options);
    console.log(rewardPot,'-------------------------------->>>>>>>>>>>>-------------->>>>>>>>>>>>>>>>>>>>>>>>>>')
}