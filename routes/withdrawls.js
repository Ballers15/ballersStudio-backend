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
const withdrawls = require("../controllers/withdrawls");


router.post("/v1/create/claim/withdrawl",
[authenticator, authenticateRole(["USER"])],
function(req, res, next) {
  let data =req.body;
  data.req=req.data;
  withdrawls.createClaimWithdrawl(data, function(err,response) {
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
  withdrawls.updateWithdrawl(data, function(err,response) {
    let status = 0;
    if (err) {
      status = err.status;
      return res.status(status).send(err);
    }
    status = response.status;
    return res.status(status).send(response);
  })
});













router.post( "/v1/create/transaction",
  [authenticator, authenticateRole(["USER"])],
  function (req, res, next) {
      let data = req.body;
    data.req = req.data;
    withdrawls.createTransaction(data, function (err, response) {
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


router.get( "/v1/all/transaction",
  [authenticator, authenticateRole(["USER"])],
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    withdrawls.getAllwithdrawls(data, function (err, response) {
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

router.get( "/v1/transaction",
  [authenticator, authenticateRole(["USER"])],
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    withdrawls.getTransactionById(data, function (err, response) {
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