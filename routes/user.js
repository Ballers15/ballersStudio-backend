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
const users = require("../controllers/user");



router.get( "/v1/token/balance",
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    users.getTokenBalance(data, function (err, response) {
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


router.get( "/v1/check/nfts",
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    users.getNftsInWalletAddress(data, function (err, response) {
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



router.get( "/v1/all",[authenticator, authenticateRole(["ADMIN"])],
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    users.getAllUsers(data, function (err, response) {
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

router.get( "/v1/user/game/details",
[authenticator, authenticateRole(["ADMIN"])],
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    users.getUserGameDetails(data, function (err, response) {
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



router.patch(
	"/v1/admin/update/users/status",
	[authenticator, authenticateRole(["ADMIN"])],
	function (req, res, next) {
		let data = req.body;
		data.req = req.data;

		users.updateUserStatus(data, function (err, response) {
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


router.get(
	"/v1/admin/get/users/count",
	[authenticator, authenticateRole(["ADMIN"])],
	function (req, res, next) {
		let data = req.query;
		data.req = req.data;

		users.getUserCount(data, function (err, response) {
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
