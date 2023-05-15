const client =require('../models/pg');
const web3Service =require('../helpers/web3Service');
const responseUtilities = require("./sendResponse");


let updateCash=async(data,response,cb)=>{
    if(!cb){
        cb=response;
    }

data.userId=data.userId.toString();
console.log("AAAA",data.userId,typeof data.userId,`SELECT * FROM user_settings_string_models WHERE email="${data.userId}" AND key='BANK_REPOSITORY_DATA'`);


    client.query(`SELECT * FROM user_settings_string_models WHERE email='${data.userId}' AND key='BANK_REPOSITORY_DATA';`,(err,res)=>{
        if(err){
            console.log(err);
        }
        console.log("res",res);
        if(res && res.rows.length){

            let sendData={encryptedText:res.rows[0].value};
            let decryptedResponse=web3Service.decrypt(sendData);
            console.log("typeof",typeof decryptedResponse);
            decryptedResponse=decryptedResponse.trim();
            let decryptedObject=JSON.parse((decryptedResponse));
             console.log("decryptedObject",decryptedObject);
            console.log("decrrr",decryptedObject.strSoftCurrencyCount);
            if(decryptedObject&&decryptedObject.strSoftCurrencyCount){
                console.log("hi");
                decryptedObject.strSoftCurrencyCount="0";
            }
            let sendDecryptedData={
                plainText:JSON.stringify(decryptedObject)
            }
    
            let encryptedResponse=web3Service.encrypt(sendDecryptedData);
            console.log("RESPONSE",typeof encryptedResponse,"ddd",encryptedResponse);
            client.query(`UPDATE user_settings_string_models SET value ='${encryptedResponse}' WHERE key ='BANK_REPOSITORY_DATA' AND email = '${data.userId}';`,(err,res)=>{
                if(err){
                    console.log(err);
                   cb(err);
                }
                cb(null,{});
    
           })   
    


        // let sendData={encryptedText:res.rows[0].value};
        // let decryptedResponse=web3Service.decrypt(sendData);
        // let decryptedObject=JSON.parse(decryptedResponse);
        //  console.log("decryptedObject",decryptedObject);
        // if(decryptedObject&&decryptedObject.strSoftCurrencyCount){
        //     console.log("hi");
        //     decryptedObject.strSoftCurrencyCount="0";
        //     decryptedObject.cryptoCurrencyCount="0.0";
        // }
        // let sendDecryptedData={
        //     plainText:JSON.stringify(decryptedObject)
        // }

        // let encryptedResponse=web3Service.encrypt(sendDecryptedData);
        // console.log("RESPONSE",typeof encryptedResponse,"ddd",encryptedResponse);
        // encryptedResponse=JSON.stringify(encryptedResponse);
        // client.query(`UPDATE user_settings_string_models SET value = ${encryptedResponse} WHERE key = 'BANK_REPOSITORY_DATA' AND email = '${data.userId}';`,(err,res)=>{
        //     if(err){
        //         console.log(err);
        //         cb(err);
        //     }
        //     cb(null,{});

        // })   
    }else{
        cb(null,"No record found")
    }
    
    })





}


let getCash=async(data,response,cb)=>{
    if(!cb){
        cb=response;
    }

data.userId=data.walletAddress;
console.log("AAAA",data.userId,typeof data.userId,`SELECT * FROM user_settings_string_models WHERE email="${data.userId}" AND key='BANK_REPOSITORY_DATA'`);


// let sendRes={
//     walletAddress:data.walletAddress,
//     amount:1000
//   };
//   console.log("SENDDDD",sendRes);
// return cb(
//     null,
//     responseUtilities.responseStruct(
//       200,
//       "Game Cash fetched Successfully",
//       "getGameCash",
//       sendRes,
//       data.req.signature
//     )
//   );


    client.query(`SELECT * FROM user_settings_string_models WHERE email='${data.userId}' AND key='BANK_REPOSITORY_DATA';`,(err,res)=>{
        if(err){
            console.log(err);
        }
        if(res && res.rows.length){

            let sendData={encryptedText:res.rows[0].value};

            let decryptedResponse=web3Service.decrypt(sendData);

            
            let decryptedObject=JSON.parse((decryptedResponse));

            let sendResposne={
                amount:decryptedObject.strSoftCurrencyCount
            }
    

            let sendRes={
                walletAddress:data.walletAddress,
                amount:decryptedObject.strSoftCurrencyCount
              };
              console.log("SENDDDD",sendRes);
                            return cb(
                null,
                responseUtilities.responseStruct(
                  200,
                  "Game Cash fetched Successfully",
                  "getGameCash",
                  sendRes,
                  data.req.signature
                )
              );


               
    
    }else{

        let sendRes={
            walletAddress:data.walletAddress,
            amount:0
          };
        return cb(
            null,
            responseUtilities.responseStruct(
              200,
              "Game Cash fetched Successfully",
              "getGameCash",
              sendRes,
              data.req.signature
            )
          );
    }
    
    })





}
module.exports={
    updateCash,
    getCash
}


// a();
