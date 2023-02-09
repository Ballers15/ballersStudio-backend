// Fetching the environment
const env = process.env.NODE_ENV || 'development';

// Common Environment Variables
const commonVariables = {
    
    ENCRYPT_SALT_STATIC: 'dSDFeFenyL2jaSDasdaeFenyL2jas@766sar7^^#&W^FSDBGxg7dgBGxg7dgqw3FSQ',
    ROLE : ['USER','ADMIN','SUPER_ADMIN'],
    STATUS: [200, 500, 400, 401],
    SERVICE_RPC_HOST: 'http://localhost',
    SERVICE_REST_PORT: '8001',
    SERVICE_RPC_PORT: '8002',
    DB_ENV: 'development',
    pageLimit: 10,
    REWARD_POT: ["REWARDPOT", "LOTTERYPOT"],
    ASSEST_TYPE: ["TOKEN", "NFT"],
    TRANSACTION_STATUS: ["PENDING","PROCESSING","COMPLETED","FAILED"],
    NFT_POINTS:JSON.stringify({"0":0,"1":1,"2":3,"3":6,"4":10,"5":15 ,"6":21,"7":28,"8":36,"9":45,"10":55,"11":66,"12":78,"13":91,"14":105,"15":120,"16":136,"17":153})
}

//setting the common variables
Object.keys(commonVariables).forEach((key) => {
    process.env[key] = commonVariables[key];
})

if (env === 'development') {

    const developmentEnvConfig = require('./development');
    Object.keys(developmentEnvConfig).forEach((key) => {
        process.env[key] = developmentEnvConfig[key];
    
    })
} else { // PRODUCTION

    const productionEnvConfig = require('./production');
    Object.keys(productionEnvConfig).forEach((key) => {
        process.env[key] = productionEnvConfig[key];
    })
}

