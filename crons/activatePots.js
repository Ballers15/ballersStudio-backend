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
  
    var currentDate=new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    var currentTime = moment(currentDate).format('YYYY-MM-DDTHH:mm:ssZZ')
        console.log("currentTime",currentTime,"sss",currentDate);
    
    // if (
    //   new Date( data.potDetails.startDate).getTime() < currentTime &&
    //   currentTime <= new Date (data.potDetails.endDate).getTime()
    // ) {

    let findDate = {
        isActive:true,
        potStatus:"UPCOMING",
        startDate: {$lte:currentDate},
        endDate:{$gte:currentDate}
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