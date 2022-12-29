let mongoose = require('./db');

// grab the things we need
let Schema = mongoose.Schema;

var cryptoWalletSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    walletAddress: String,
    chain:String
},{ timestamps: true });

const cryptoWallet = mongoose.model('cryptowallet', cryptoWalletSchema);

module.exports = cryptoWallet;