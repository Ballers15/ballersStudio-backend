## Version 0.0.1
* User Login/Signup api's
* Admin Panel with user and pool Add/Listing api's
* Activate/Inactivate reward distributions
* Reward distribution according to the required lottery system.




# bin
* `www.js` describe module dependency for the server.
# config
* `index.js` contains all the server constants according to the env variable for development and production using `development.js` & `production.js`.

# Controllers 
# Routes 
# Models 
* `controllers/auth.js` Function description with all core logics used in `routes/auth.js`,and all the query and data integration used on the basis of schema defined in `model/db.js` `model/loginStats.js` `model/otpLogs.js` `model/resetPasswords.js`

* `controllers/cryptoWallet.js` Function description with all core logics used in `routes/cryptoWallet.js`, and all the query and data integration used is on the basis of schema defined in `models/cryptoWallet.js` 

* `controllers/rewardPot.js` Function description with all core logics used in `routes/rewardPot.js`, and all the query and data integration used is on the basis of schema defined in `models/rewardPot.js` 

* `controllers/user.js` Function description with all core logics used in `routes/user.js`, and all the query and data integration used is on the basis of schema defined in `models/users.js` 

* `controllers/userBalance.js` Function description with all core logics used in `routes/userBalance.js`, and all the query and data integration used is on the basis of schema defined in `models/userBalance.js` 

* `controllers/withdrawls.js` Function description with all core logics used in `routes/withdrawls.js`, and all the query and data integration used is on the basis of schema defined in `models/withdrawls.js` 

# Crons
* `activateRewardPot.js` used to activate all the reward pots whose expiry date is not reached, daily at mid night 12:00 AM.
* `deactivateRewardPot.js` used to deactivate all the reward pots whose expiry date is reached, daily at mid night 12:00 AM.
# Helpers
* Module contains all the helper services function used by the server for the interaction with the users, web3 services and also used for security.
# Middleware
* `authenticateRole.js` & `authenticator.js` is used to provide authentication to the api's as per the user roles.
* `formatResponse` format all the server requests in a proper response format.
# Seeds
* `seeds.js` used to insert user in database which is described in the file itself.


* `app.js` main file contains express servers and all the validations used by the project services.