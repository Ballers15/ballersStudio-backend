let mongoose = require('./db');

let Schema = mongoose.Schema;

var notificationsSchema = new Schema({
    potId:{type:mongoose.Schema.Types.ObjectId,ref:'rewardPot'},
    message: { type: String},
    readBy:[{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    recievers:[{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    type:{
      type: String,
      enum: { values: process.env.NOTIFICATION_TYPE.split(",") },
  },
    
      notifyAll: { type: Boolean, default: true },
      createdBy:{ type: mongoose.Schema.Types.ObjectId,ref: 'users'},
  },{ timestamps: true });

const notifications = mongoose.model('notifications', notificationsSchema);

module.exports = notifications;


// POT_ANNOUCEMENTS
// NFT_WON
// CLAIM_TOKEN