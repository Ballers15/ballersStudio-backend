require('../config/index');
require('../models/db');
const cron = require('node-cron');
const RewardPot = require("../models/rewardPot");
// '*/10 * * * * *'                      10 sec
// '0 0 * * *'
let taskJob = cron.schedule('*/10 * * * * *', () => { // runs at 12:00 mid night
    deactivateClaims()
});

let deactivateClaims = async () => {
    var currentTime = new Date();
    let findDate = {
        claimExpiryDate: {$lte:currentTime}
    }

    let  options   = {
        multi:true
    }
    let updateData = { "$set": { "claimPot": false } };

    let rewardPot = await RewardPot.updateMany(findDate, updateData, options);
    let rewardPotdata = await RewardPot.find({})
    console.log(rewardPot,'-------------------------------->>>>>>>>>>>>-------------->>>>>>>>>>>>>>>>>>>>>>>>>>')
    console.log(rewardPotdata,'-------------------------------->>>>>>>>>>>>-------------->>>>>>>>>>>>>>>>>>>>>>>>>>')
}