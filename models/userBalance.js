let mongoose = require('./db');

let Schema = mongoose.Schema;

var userBalanceSchema = new Schema({
    potId: { type: mongoose.Schema.Types.ObjectId, ref: "rewardPot" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    walletAdress:String,
    amount: Number,
},{ timestamps: true });

const userBalance = mongoose.model('userBalance', userBalanceSchema);

module.exports = userBalance;