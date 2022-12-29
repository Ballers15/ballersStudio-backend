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

const rewardPot = require("../controllers/rewardPot");

router.post( "/v1/admin/create/reward/pot",
  [authenticator, authenticateRole(["ADMIN"])],
  function (req, res, next) {
      let data = req.body;
    data.req = req.data;
    rewardPot.createRewardPot(data, function (err, response) {
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


router.patch( "/v1/admin/update/reward/pot",
  [authenticator, authenticateRole(["ADMIN"])],
  function (req, res, next) {
      let data = req.body;
    data.req = req.data;
    rewardPot.updateRewardPot(data, function (err, response) {
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


router.patch( "/v1/admin/delete/reward/pot",
  [authenticator, authenticateRole(["ADMIN"])],
  function (req, res, next) {
      let data = req.body;
    data.req = req.data;
    rewardPot.deleteRewardPot(data, function (err, response) {
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


router.get( "/v1/admin/getall/reward/pot",
  [authenticator, authenticateRole(["ADMIN"])],
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    rewardPot.getAllRewardPots(data, function (err, response) {
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

router.get( "/v1/admin/getbyid/reward/pot",
  [authenticator, authenticateRole(["ADMIN"])],
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    rewardPot.getRewardPotsById(data, function (err, response) {
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
