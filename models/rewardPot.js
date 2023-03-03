let mongoose = require('./db');

let Schema = mongoose.Schema;

var rewardPotSchema = new Schema({
    rewardTokenAmount : Number,
    // ticker: String,
    //   contractAddress: String,
    //   assetName:String,
    //   tokenId:String,
    assetDetails: { type: Object },
    startDate: Date,
    endDate: Date,
    claimExpiryDate: Date,
    potAmountCollected:Number,
    //CAN BE STOPPED BY ADMIN 
    claimPot:{ type: Boolean, default: true },
    assetType:{
      type: String,
      enum: { values: process.env.ASSEST_TYPE.split(",") },
    }, 
    potType:{
        type: String,
        enum: { values: process.env.REWARD_POT.split(",") },
      },
    isActive: { type: Boolean, default: true },
    createdBy:{ type: mongoose.Schema.Types.ObjectId,ref: 'users'},
    
},{ timestamps: true });

const rewardPot = mongoose.model('rewardPot', rewardPotSchema);

module.exports = rewardPot;