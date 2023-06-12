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
const Notifications = require("../controllers/notifications");




/**
 * gives Notifications
 * 
 */
router.get("/v1/user/get/notifications",
[authenticator, authenticateRole(["USER"])],
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;

    Notifications.getNotifications(data, function (err, response) {
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



router.post("/v1/user/read/particular/notifications",
[authenticator, authenticateRole(["USER"])],
  function (req, res, next) {
      let data = req.body;
    data.req = req.data;

    Notifications.readNotifications(data, function (err, response) {
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


router.post("/v1/user/read/all/notifications",
[authenticator, authenticateRole(["USER"])],
  function (req, res, next) {
      let data = req.body;
    data.req = req.data;

    Notifications.readAllNotifications(data, function (err, response) {
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
