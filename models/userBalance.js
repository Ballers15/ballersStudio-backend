let mongoose = require('./db');

let Schema = mongoose.Schema;

var userBalanceSchema = new Schema({
    potId: { type: mongoose.Schema.Types.ObjectId, ref: "rewardPot" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    walletAddress:String,
    amount: Number,
    nftHolded:{type:Number,default:0},
    rewardClaimed:{type:Boolean ,default:false}
},{ timestamps: true });

const userBalance = mongoose.model('userBalance', userBalanceSchema);

module.exports = userBalance;