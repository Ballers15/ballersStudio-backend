const express = require("express");
const router = express.Router();
const formatRequest = require("../middlewares/formatRequest");
router.use(formatRequest);
const clients = {
    users: {
        host: process.env.SERVICE_RPC_HOST,
        port: process.env.SERVICE_RPC_PORT
    }
};

const data = {};
const authenticator = require('../middlewares/authenticator')(clients, data);
const authenticateRole = require('../middlewares/authenticateRole');

const userPotDetails = require("../controllers/userPotDetails");

/**
 * Add reward Pot balance 
*/


router.post( "/v1/add/reward/pot/balance",[authenticator, authenticateRole(["USER"])],
  function (req, res, next) {
      let data = req.body;
    data.req = req.data;
    userPotDetails.adduserPotDetails(data, function (err, response) {
      let status = 0;
      if (err) {
        status = err.status;
        return res.status(status).send(err);
      }
      status = response.status;
      return res.status(status).send(response);
    });
  }
);

/**
 * Add Lottery  Pot balance 
*/
router.post( "/v1/add/lottery/pot/balance",[authenticator, authenticateRole(["USER"])],
  function (req, res, next) {
      let data = req.body;
    data.req = req.data;
    userPotDetails.addLotteryPotBalance(data, function (err, response) {
      let status = 0;
      if (err) {
        status = err.status;
        return res.status(status).send(err);
      }
      status = response.status;
      return res.status(status).send(response);
    });
  }
);









// Not in use
router.post( "/v1/update/lotterynumber",[authenticator, authenticateRole(["USER"])],
  function (req, res, next) {
      let data = req.body;
    data.req = req.data;
    userPotDetails.updateLotterNumber(data, function (err, response) {
      let status = 0;
      if (err) {
        status = err.status;
        return res.status(status).send(err);
      }
      status = response.status;
      return res.status(status).send(response);
    });
  }
);


router.get( "/v1/balance/all",[authenticator, authenticateRole(["USER"])],
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    userPotDetails.getAlluserPotDetails(data, function (err, response) {
      let status = 0;
      if (err) {
        status = err.status;
        return res.status(status).send(err);
      }
      status = response.status;
      return res.status(status).send(response);
    });
  }
);


router.get( "/v1/balance",[authenticator, authenticateRole(["USER"])],
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    userPotDetails.getuserPotDetailsById(data, function (err, response) {
      let status = 0;
      if (err) {
        status = err.status;
        return res.status(status).send(err);
      }
      status = response.status;
      return res.status(status).send(response);
    });
  }
);

/**
 * Create Claim  for reward pot
*/

router.post("/v1/create/claim/withdrawl",
[authenticator, authenticateRole(["USER"])],
function(req, res, next) {
  let data =req.body;
  data.req=req.data;
  userPotDetails.createClaimWithdrawl(data, function(err,response) {
    let status = 0;
    if (err) {
      status = err.status;
      return res.status(status).send(err);
    }
    status = response.status;
    return res.status(status).send(response);
  })
});

/**
 * Update Claim  for reward pot
*/

router.post("/v1/update/withdrawl",
[authenticator, authenticateRole(["USER"])],
function(req, res, next) {
  let data =req.body;
  data.req=req.data;
  userPotDetails.updateWithdrawl(data, function(err,response) {
    let status = 0;
    if (err) {
      status = err.status;
      return res.status(status).send(err);
    }
    status = response.status;
    return res.status(status).send(response);
  })
});

/**
 * Create Claim  for Lottery pot
*/


router.post( "/v1/create/lottery/claim",[authenticator, authenticateRole(["USER"])],
function(req, res, next) {
  let data =req.body;
  data.req=req.data;
  userPotDetails.createLotteryClaim(data, function(err,response) {
    let status = 0;
    if (err) {
      status = err.status;
      return res.status(status).send(err);
    }
    status = response.status;
    return res.status(status).send(response);
  })
})


/**
 * Update Claim  for Lottery pot
*/


router.post("/v1/update/lottery/withdrawl",
[authenticator, authenticateRole(["USER"])],
function(req, res, next) {
  let data =req.body;
  data.req=req.data;
  userPotDetails.updateLotteryWithdrawl(data, function(err,response) {
    let status = 0;
    if (err) {
      status = err.status;
      return res.status(status).send(err);
    }
    status = response.status;
    return res.status(status).send(response);
  })
});


/**
 * api to get  game cash
*/

router.get("/v1/get/game/cash",
function(req, res, next) {
  let data = req.query;
  data.req = req.data;
  userPotDetails.getGameCash(data, function(err,response) {
    let status = 0;
    if (err) {
      status = err.status;
      return res.status(status).send(err);
    }
    status = response.status;
    return res.status(status).send(response);
  })
});


/**Remove api from production */
router.post("/v1/update/game/cash",
function(req, res, next) {
  
  let data =req.body;
  data.req=req.data;
  userPotDetails.updateGameCash(data, function(err,response) {
    let status = 0;
    if (err) {
      status = err.status;
      return res.status(status).send(err);
    }
    status = response.status;
    return res.status(status).send(response);
  })
  
  
});

router.get("/v1/check/user/won/lottery",
[authenticator, authenticateRole(["USER"])],
function(req, res, next) {
  let data = req.query;
  data.req = req.data;
  userPotDetails.checkUserWonLottery(data, function(err,response) {
    let status = 0;
    if (err) {
      status = err.status;
      return res.status(status).send(err);
    }
    status = response.status;
    return res.status(status).send(response);
  })
});


/**
 * Check If user claim or not
*/

router.get("/v1/check/user/claimed/reward",
[authenticator, authenticateRole(["USER"])],
function(req, res, next) {
  let data = req.query;
  data.req = req.data;
  userPotDetails.checkUserClaimedReward(data, function(err,response) {
    let status = 0;
    if (err) {
      status = err.status;
      return res.status(status).send(err);
    }
    status = response.status;
    return res.status(status).send(response);
  })
});







/********************************************************** ADMIN ********************************************************************* */

/**
 *  Get user for a particular pot
 */

router.get( "/v1/specific/pot/users",
[authenticator, authenticateRole(["ADMIN"])],
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    userPotDetails.getSpecificPotUsers(data, function (err, response) {
      let status = 0;
      if (err) {
        status = err.status;
        return res.status(status).send(err);
      }
      status = response.status;
      return res.status(status).send(response);
    });
  }
);
/**
 *  Pot claim analytics
 */


router.get( "/v1/admin/pot/claim/analytics",
[authenticator, authenticateRole(["ADMIN"])],
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    userPotDetails.getTotalClaimCount(data, function (err, response) {
      let status = 0;
      if (err) {
        status = err.status;
        return res.status(status).send(err);
      }
      status = response.status;
      return res.status(status).send(response);
    });
  }
);

/**
 *  users of game in pie chart 
 */

router.get("/v1/admin/get/user/piechart",
[authenticator, authenticateRole(["ADMIN"])],
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    userPotDetails.getUsersPieChart(data, function (err, response) {
      let status = 0;
      if (err) {
        status = err.status;
        return res.status(status).send(err);
      }
      status = response.status;
      return res.status(status).send(response);
    });
  }
);

/**
 *  users of game in last 10 pots 
 */

router.get("/v1/admin/get/user/barchart",
[authenticator, authenticateRole(["ADMIN"])],
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    userPotDetails.getUsersBarChart(data, function (err, response) {
      let status = 0;
      if (err) {
        status = err.status;
        return res.status(status).send(err);
      }
      status = response.status;
      return res.status(status).send(response);
    });
  }
);






module.exports = router;
