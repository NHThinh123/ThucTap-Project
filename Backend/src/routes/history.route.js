const express = require("express");
const router = express.Router();
const {
  createHistory,
  getHistory,
  getAllHistories,
  updateWatchDuration,
  deleteHistory,
  deleteAllHistories,
} = require("../controllers/history.controller");

router
  .route("/")
  .post(createHistory)
  .get(getAllHistories)
  .delete(deleteAllHistories);

router
  .route("/:id")
  .get(getHistory)
  .patch(updateWatchDuration)
  .delete(deleteHistory);

module.exports = router;
