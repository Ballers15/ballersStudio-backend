let mongoose = require('./db');

let Schema = mongoose.Schema;

var rewardPotSchema = new Schema({
    rewardTokenAmount : Number,
    assetDetails: { type: Object },
    startDate: Date,
    endDate: Date,
    claimExpiryDate: Date,
    potAmountCollected:{ type: mongoose.Schema.Types.Decimal128, default: 0 },
    claimPot:{ type: Boolean, default: true },
    assetType:{
      type: String,
      enum: { values: process.env.ASSEST_TYPE.split(",") },
    }, 
    potType:{
        type: String,
        enum: { values: process.env.REWARD_POT.split(",") },
    },
    potStatus:{ 
      type: String,
      enum: { values: process.env.POT_STATUS.split(",") }
    },  
    isActive: { type: Boolean, default: true },
    createdBy:{ type: mongoose.Schema.Types.ObjectId,ref: 'users'},
    
},{ timestamps: true });

const rewardPot = mongoose.model('rewardPot', rewardPotSchema);

module.exports = rewardPot;