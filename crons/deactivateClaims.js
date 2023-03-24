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
    var currentDate=new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    var currentTime = moment(currentDate).format('YYYY-MM-DDTHH:mm:ssZZ')
        console.log("currentTime",currentTime,"sss",currentDate);
    let findDate = {
        isActive:true,
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