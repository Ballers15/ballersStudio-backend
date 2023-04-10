const client =require('../models/pg');
const web3Service =require('../helpers/web3Service');


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
        console.log("RESPONSE",res.rows);
        let sendData={encryptedText:res.rows[0].value};
        let decryptedResponse=web3Service.decrypt(sendData);
        let decryptedObject=JSON.parse(decryptedResponse);
         console.log("decryptedObject",decryptedObject);
        if(decryptedObject&&decryptedObject.strSoftCurrencyCount){
            console.log("hi");
            decryptedObject.strSoftCurrencyCount="0";
        }
        let sendDecryptedData={
            plainText:JSON.stringify(decryptedObject)
        }

        let encryptedResponse=web3Service.encrypt(sendDecryptedData);
        console.log("RESPONSE",typeof encryptedResponse,"ddd",encryptedResponse);
    
        client.query(`UPDATE user_settings_string_models SET value = '${encryptedResponse}' WHERE key = 'BANK_REPOSITORY_DATA' AND email = '${data.userId}';`,(err,res)=>{
            if(err){
                console.log(err);
                cb(err);
            }
            cb(null,{});

        })   
    })





}
module.exports={
    updateCash
}


// a();
