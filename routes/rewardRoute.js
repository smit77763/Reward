const express = require("express");
const { updateOne } = require("../modle/rewardModle");
const router = express.Router();
const rewardController = require("./../controller/rewardController");

router
  .route("/")
  .get(rewardController.getAllReward)
  .post(rewardController.createOne)
  .put(rewardController.updateReward);

module.exports = router;
