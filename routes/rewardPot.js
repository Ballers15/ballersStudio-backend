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

const rewardPot = require("../controllers/rewardPot");


/**
 * gives active Pot
 * Non Authenticated
 */
router.get( "/v1/user/get/active/pot",
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;

    rewardPot.getActivePot(data, function (err, response) {
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
 * gives  reward Pot Leaderboard
 * Non Authenticated
*/

router.get( "/v1/user/get/reward/pot/leaderboard",
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    rewardPot.getRewardPotLeaderBoard(data, function (err, response) {
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
 * gives  Lottery Pot Leaderboard for current pot
 * Non Authenticated
 */

router.get( "/v1/user/get/lottery/pot/leaderboard",
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    rewardPot.getLotteryPotLeaderBoard(data, function (err, response) {
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
 * gives  Lottery Pot last rounds details
 * Non Authenticated
 */
router.get( "/v1/user/get/lottery/pot/previous/rounds",
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    rewardPot.getLotteryPotBoardPreviousRounds(data, function (err, response) {
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
 * gives  Reward Pot last rounds details
 * Non Authenticated
*/

router.get("/v1/user/get/reward/pot/previous/rounds",
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    rewardPot.getRewardPotBoardPreviousRounds(data, function (err, response) {
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





















/******************************************************************ADMIN****************************************************************************************** */
/**
 * create pot
 */
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


/**
 * update pot
 */
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
/**
 * update pot status soft delete this means pot will not be shown to user in any case
 */


router.patch( "/v1/admin/reward/pot/status",
  [authenticator, authenticateRole(["ADMIN"])],
  function (req, res, next) {
      let data = req.body;
    data.req = req.data;
    rewardPot.updateRewardPotStatus(data, function (err, response) {
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
 * soft delete pot not in use
 */

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

/**
 * Gives active reward pots
 */

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



/**
 * Gives upcoming reward pots
 */

router.get( "/v1/admin/upcoming/reward/pot",
  [authenticator, authenticateRole(["ADMIN"])],
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    rewardPot.getUpcomingRewardPots(data, function (err, response) {
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
 * Gives archives reward pots
 */

router.get( "/v1/admin/archive/reward/pot",
  [authenticator, authenticateRole(["ADMIN"])],
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    rewardPot.getArchivePots(data, function (err, response) {
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


// NOT IN USE


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










/**
 * stop claim of pot
 */

router.patch( "/v1/admin/stop/reward/pot/claim",
  [authenticator, authenticateRole(["ADMIN"])],
  function (req, res, next) {
      let data = req.body;
    data.req = req.data;
    rewardPot.updateClaimOfRewardPot(data, function (err, response) {
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
 * Count for active , archive and upcoming pots
 */


router.get( "/v1/admin/pot/counts",
  [authenticator, authenticateRole(["ADMIN"])],
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    rewardPot.getPotCounts(data, function (err, response) {
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
 * Check if NFT is present in calim contract
 */


router.get("/v1/check/nft/claim/contract",
  [authenticator, authenticateRole(["ADMIN"])],
  function (req, res, next) {
      let data = req.query;
    data.req = req.data;
    rewardPot.checkNftClaimContract(data, function (err, response) {
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
