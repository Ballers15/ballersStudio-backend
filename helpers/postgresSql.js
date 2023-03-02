const client =require('../models/pg');


// SELECT * FROM manav WHERE key = 'your_key_value' AND email = 'your_email_value';

//   accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,

let a=async()=>{
    let email="0xd946F28962A96C45d9Bc16F16ca50d8350296A4E";
    let a=`manav+${email}`;
    console.log("manav",a);
    
    // client.query("SELECT * FROM user_access_tokens_models WHERE email = '0xd946F28962A96C45d9Bc16F16ca50d8350296A4E';",(err,res)=>{
    //     if (err) throw err;
    //      console.log(res.rows);

    // })

    
    
    
    client.query("SELECT * FROM user_settings_string_models WHERE email='0xd946F28962A96C45d9Bc16F16ca50d8350296A4E' AND key='BANK_REPOSITORY_DATA';",(err,res)=>{
        if(err){
            console.log(err);
        }
        console.log(res.rows);
    })





}

a();
