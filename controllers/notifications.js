const async = require("async");
const mongoose = require("mongoose");
//models
const PotActionLogs = require("../models/potActionLogs");
const RewardPot = require("../models/rewardPot");
const userPotDetails = require("../models/userPotDetails");
const Notifications=require("../models/notifications");
//helpers
const responseUtilities = require("../helpers/sendResponse");
const web3Service = require("../helpers/web3Service");
const helper = require('../controllers/userPotDetails')
const responseMessages=require("../config/responseMessages");
const notifications = require("../models/notifications");





const getNotifications = function(data,response,cb){
    if(!cb){
        cb=response;
    }

    let findData={
        $and: [
            {
              $or: [
                { recievers: { $in:[data.req.auth.id] } },
                {notifyAll:true}
              ],
            },
            {
                readBy:{$nin:[data.req.auth.id]}
            }

          ],
    }

    Notifications.find(findData,(err,res)=>{
        if(err){
            console.log("getNotifications : ", err);
            return cb(
              responseUtilities.responseStruct(
                500,
                "Error in Notifications",
                "getNotifications",
                null,
                data.req.signature
              )
            );

        }
        console.log("res",res)
        return cb(
            null,
            responseUtilities.responseStruct(
              200,
              "Notifications Fetched Successfuly",
              "getNotifications",
              res,
              data.req.signature
            )
          );
    })


}

exports.getNotifications=getNotifications;



const readNotifications =function(data,response,cb){
    if(!cb){
        cb=response;

    }
    if(!data.notificationId){
        return cb(
            responseUtilities.responseStruct(
              400,
              "readNotifications",
              "readNotifications",
              null,
              data.req.signature
            )
          );
    }
    let findData={
        _id:data.notificationId
    }

    let updateData = {
        $addToSet: {
            readBy: data.req.auth.id,
        },
    };

    let options={
        new:true,
    }

    Notifications.findOneAndUpdate(findData,updateData,options,(err,res)=>{
        if(err){
            console.log(err);
            return cb(
                responseUtilities.responseStruct(
                  500,
                  "Error in Notifications",
                  "readNotifications",
                  null,
                  data.req.signature
                )
              );
        }
        return cb(
            null,
            responseUtilities.responseStruct(
              200,
              "Notifications read Successfuly",
              "readNotifications",
              res,
              data.req.signature
            )
          );
    })
}
exports.readNotifications=readNotifications;



const readAllNotifications =function(data,response,cb){
    if(!cb){
        cb=response;
    }

    let waterFallFunctions=[];
    waterFallFunctions.push(async.apply(getUnreadNotiication, data));
    waterFallFunctions.push(async.apply(markNotifications, data));
    async.waterfall(waterFallFunctions, cb);

}

exports.readAllNotifications=readAllNotifications;


const getUnreadNotiication =function(data,response,cb){
    if(!cb){
        cb=response;
    }

    let findData={
            readBy:{$nin:[data.req.auth.id]}        
    }

    Notifications.find(findData,(err,res)=>{
        if(err){
            console.log(err);
            return cb(
                responseUtilities.responseStruct(
                  500,
                  "Error in Notifications",
                  "getUnreadNotiication",
                  null,
                  data.req.signature
                )
              );
        }
        let unreadNotification=res.map((el)=>{
            return el._id;
        })
        data.unreadNotification=unreadNotification

        return cb(
            null,
            responseUtilities.responseStruct(
              200,
              "unread fetched Successfuly",
              "getUnreadNotiication",
              res,
              data.req.signature
            )
          );
    })
}

const markNotifications =function(data,response,cb){
    if(!cb){
        cb=response;
    }

    let findData={
        _id:{$in:data.unreadNotification}
    }

    console.log("findData",findData,data.unreadNotification);
// return;
    let updateData = {
        $addToSet: {
            readBy: data.req.auth.id,
        },
    };

    let options={
        new:true,
    }

    Notifications.updateMany(findData,updateData,options,(err,res)=>{
        if(err){
            console.log(err);
            return cb(
                responseUtilities.responseStruct(
                  500,
                  "Error in Notifications",
                  "markNotifications",
                  null,
                  data.req.signature
                )
              );
        }
        console.log("ressss",res);
        return cb(
            null,
            responseUtilities.responseStruct(
              200,
              "Notifications read Successfuly",
              "markNotifications",
              res,
              data.req.signature
            )
          );
    })


}





