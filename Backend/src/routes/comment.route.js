const express = require("express");
const router = express.Router({ mergeParams: true });
const commentController = require("../controllers/comment.controller");

// Quản lý bình luận
router
  .route("/")
  .get(commentController.getVideoComments) // GET /api/comments
  .post(commentController.createComment); // POST /api/comments

router.route("/reply").get(commentController.getReplyComments); // GET /api/comments/reply

router.get("/count", commentController.getVideoCommentsCount); // GET /api/comments/count

router
  .route("/:id")
  .get(commentController.getComment) // GET /api/comments/:id
  .patch(commentController.updateComment) // PATCH /api/comments/:id
  .delete(commentController.deleteComment); // DELETE /api/comments/:id

module.exports = router;
