/**
 * Database config and initialization
 */

const mongoose = require('mongoose');

const opt = {
    // user: user,
    // pass: pass,
    // auth: {
    //     authdb: "admin"
    // },
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex:true
    
};

let connstring = process.env.mongoConnectionString;
connstring= "mongodb://mongo:27017/ballers";
console.log("connstring:",connstring);

const connectWithRetry = function() {
    console.log("connstringconnstringconnstring",connstring);
    return mongoose.connect(connstring, opt, function(err) {
        if (err) {
            console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
            setTimeout(connectWithRetry, 5000);
        }else{
            console.log("Mongodb Connection Established");
        }
    });
};
connectWithRetry();

module.exports = mongoose;
