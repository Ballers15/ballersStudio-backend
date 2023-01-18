module.exports = production = {
    DEV:false,
    mongoConnectionString: 'mongodb://localhost/ballers',// Production mongodb connection string
    POLYGON_RPC_URL:"https://rpc-mainnet.maticvigil.com",
    BALLERS_TOKEN_ADDRESS:"",
    MAILJET_APIKEY_PUBLIC: '3729e819f31fac27b63b75bab2b67faf',
    MAILJET_APIKEY_PRIVATE: '3e54a323b447b13f99178fc6310761e3',
    MAILJET_CONTACT_LIST:JSON.stringify({
        ballers:39005,
    }),
}