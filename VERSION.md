# bin
* `www.js` describe module dependency for the server.

# config
* `index.js` contains all the server constants according to the env variable for development and production using `development.js` & `production.js`.

# Controllers 
# Routes 
# Models 
* [linky](./controllers/auth.js) Function description with all core logics used in [linky](./routes/auth.js),and all the query and data integration used on the basis of schema defined in [linky](./models/db.js) [linky](./models/loginStats.js) [linky](./models/otpLog.js) [linky](./models/resetPasswords.js)  

* [linky](./controllers/cryptoWallet.js) Function description with all core logics used in  [linky](./routes/cryptoWallet.js), and all the query and data integration used is on the basis of schema defined in [linky](./models/cryptoWallet.js) 

* [linky](./controllers/rewardPot.js) Function description with all core logics used in  [linky](./routes/rewardPot.js), and all the query and data integration used is on the basis of schema defined in [linky](./models/rewardPot.js) [linky](./models/potActionLogs.js) 

* [linky](./controllers/user.js) Function description with all core logics used in  [linky](./routes/user.js), and all the query and data integration used is on the basis of schema defined in [linky](./models/users.js) 

* [linky](./controllers/userBalance.js) Function description with all core logics used in  [linky](./routes/userBalance.js), and all the query and data integration used is on the basis of schema defined in [linky](./models/userBalance.js) 

* [linky](./controllers/withdrawls.js) Function description with all core logics used in  [linky](./routes/withdrawls.js), and all the query and data integration used is on the basis of schema defined in [linky](./models/withdrawls.js) 

# Crons
* [linky](./crons/activateRewardPot.js)  used to activate all the reward pots whose expiry date is not reached, daily at mid night 12:00 AM.
* [linky](./crons/deactivateRewardPot.js)  used to deactivate all the reward pots whose expiry date is reached, daily at mid night 12:00 AM.

# Helpers
* Module contains all the helper services function used by the server for the interaction with the users, web3 services and also used for security.

# Middleware
* `authenticateRole.js` & `authenticator.js` is used to provide authentication to the api's as per the user roles.
* `formatResponse` format all the server requests in a proper response format.

# Seeds
* [linky](./seeds/seeds.js)used to insert user in database which is described in the `seeds.js` file.

# app.js
* main file contains express servers and all the validations used by the project services.