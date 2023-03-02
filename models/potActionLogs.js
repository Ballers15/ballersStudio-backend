let mongoose = require('./db');

let Schema = mongoose.Schema;

var potLogsSchema = new Schema({
    potId: { type: mongoose.Schema.Types.ObjectId, ref: 'rewardPot'},
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    action:String
},{ timestamps: true });

const potLogs = mongoose.model('potLogs', potLogsSchema);

module.exports = potLogs;