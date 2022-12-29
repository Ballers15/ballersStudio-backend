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

const transactions = require("../controllers/transactions");


router.post( "/v1/create/transaction",
  [authenticator, authenticateRole(["USER"])],
  function (req, res, next) {
      let data = req.body;
    data.req = req.data;
    transactions.createTransaction(data, function (err, response) {
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
    transactions.getAllTransactions(data, function (err, response) {
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
    transactions.getTransactionById(data, function (err, response) {
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