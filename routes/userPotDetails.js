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


router.post( "/v1/add/balance",[authenticator, authenticateRole(["USER"])],
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






module.exports = router;
