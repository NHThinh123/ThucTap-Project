const express = require("express");
const router = express.Router();
const {
  createHistory,
  getHistory,
  getAllHistories,
  updateWatchDuration,
  deleteHistory,
  deleteAllHistories,
  togglePauseHistory,
} = require("../controllers/history.controller");

router.route("/").post(createHistory);

router.route("/user/:id").get(getAllHistories).delete(deleteAllHistories);

router
  .route("/:id")
  .get(getHistory)
  .patch(updateWatchDuration)
  .delete(deleteHistory);

router.route("/pause/:id/").patch(togglePauseHistory);

module.exports = router;
