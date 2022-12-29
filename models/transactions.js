let mongoose = require('./db');

let Schema = mongoose.Schema;

var transactionsSchema = new Schema({
    potId: { type: mongoose.Schema.Types.ObjectId, ref: "rewardPot" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    walletAddress:String,   
    amount:Number,
    token:{
        ticker: String,
        contractAddress: String,
      },
    signature :String,
    nonce:String,
    hash:String,
    status:{
        type: String,
        enum: { values: process.env.TRANSACTION_STATUS.split(",") },
      }
   
},{ timestamps: true });

const transactions = mongoose.model('transactions', transactionsSchema);

module.exports = transactions;