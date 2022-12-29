const express = require("express");
const router = express.Router();
const formatRequest = require("../middlewares/formatRequest");
router.use(formatRequest);
const clients = {
    users: {
        host: process.env.SERVICE_RPC_HOST,
        port: process.env.CORE_USER_PORT
    }
};

const data = {};
const authenticator = require('../middlewares/authenticator')(clients, data);
const authenticateRole = require('../middlewares/authenticateRole');

const userBalance = require("../controllers/userBalance");


router.post( "/v1/add/balance",[authenticator, authenticateRole(["USER"])],
  function (req, res, next) {
      let data = req.body;
    data.req = req.data;
    userBalance.addUserBalance(data, function (err, response) {
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
    userBalance.getAllUserBalances(data, function (err, response) {
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


router.get( "/v1/balance/byid",[authenticator, authenticateRole(["USER"])],
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    userBalance.getUserBalanceById(data, function (err, response) {
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
