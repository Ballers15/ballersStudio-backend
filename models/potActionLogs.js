let mongoose = require('./db');

let Schema = mongoose.Schema;

var potLogsSchema = new Schema({
    potId: { type: mongoose.Schema.Types.ObjectId, ref: 'rewardPot'},
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    startedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    stoppedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    message:String
},{ timestamps: true });

const potLogs = mongoose.model('potLogs', potLogsSchema);

module.exports = potLogs;