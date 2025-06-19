const express = require("express");
const router = express.Router();
const {
  createPlaylist,
  getPlaylist,
  getAllPlaylistOfUser,
  updatePlaylist,
  deletePlaylist,
} = require("../controllers/playlist.controller");

router.route("/").post(createPlaylist);
router.route("/user/:userId").get(getAllPlaylistOfUser);

router
  .route("/:id")
  .get(getPlaylist)
  .patch(updatePlaylist)
  .delete(deletePlaylist);

module.exports = router;
