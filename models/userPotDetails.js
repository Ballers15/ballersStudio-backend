let mongoose = require('./db');

let Schema = mongoose.Schema;
// user pot
var userPotDetailsSchema = new Schema({
   
    potId: { type: mongoose.Schema.Types.ObjectId, ref: "rewardPot" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    walletAddress:String,
    amount:{ type: mongoose.Schema.Types.Decimal128, default: 0 },
    gameAmount:{ type: mongoose.Schema.Types.Decimal128,default:0},
    lotteryWon:{type:Boolean,default:false},
    nftHolded:{type:Number,default:0},
    rewardedTokenAmount:{type:Number,default:0},
    rewardedTokenAmountDecimals:{type: mongoose.Schema.Types.Decimal128},
    rewardPointsPercentage:{type:Number,default:0},
    rewardPoints:{type:Number,default:0},
    rewardClaimed:{type:Boolean ,default:false},

    signature :String,
    nonce:String,
    hash:String,
    status:{
        type: String,
        enum: { values: process.env.TRANSACTION_STATUS.split(",") },
        default: "PENDING",

      }

},{ timestamps: true });

const userPotDetails = mongoose.model('userPotDetails', userPotDetailsSchema);

module.exports = userPotDetails;