require('../config/index');
require('../models/db');
const cron = require('node-cron');
const RewardPot = require("../models/rewardPot");
// '*/10 * * * * *'                      10 sec
let taskJob = cron.schedule('0 0 * * *', () => {   // runs at 12:00 mid night
    activateRewardPots()
});

let activateRewardPots = async () => {
    var currentTime = new Date();
        let findDate = {
            isActive: true,
            endDate: { $lte: currentTime }
        }
        let  options   = {
            multi:true
        }
        let updateData = { "$set": { "isActive": false } };
        let rewardPot = await RewardPot.updateMany(findDate,updateData , options);
        let rewardPotdata = await RewardPot.find({})
        console.log(rewardPot,'-------------------------------->>>>>>>>>>>>-------------->>>>>>>>>>>>>>>>>>>>>>>>>>')
        console.log(rewardPotdata,'-------------------------------->>>>>>>>>>>>-------------->>>>>>>>>>>>>>>>>>>>>>>>>>')
}