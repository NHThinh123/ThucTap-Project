const express = require("express");
const router = express.Router({ mergeParams: true });
const commentController = require("../controllers/comment.controller");

// Quản lý bình luận
router
  .route("/")
  .get(commentController.getVideoComments) // GET /api/comments
  .post(commentController.createComment); // POST /api/comments

router
  .route("/:id")
  .get(commentController.getComment) // GET /api/comments/:id
  .patch(commentController.updateComment) // PATCH /api/comments/:id
  .delete(commentController.deleteComment); // DELETE /api/comments/:id

// Khôi phục bình luận đã xóa mềm
router.patch("/:id/restore", commentController.restoreComment); // PATCH /api/comments/:id/restore

module.exports = router;
