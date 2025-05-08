const {
  createCommentService,
  getCommentByIdService,
  getVideoCommentsService,
  updateCommentService,
  deleteCommentService,
  restoreCommentService,
} = require("../services/comment.service");

const createComment = async (req, res, next) => {
  try {
    const comment = await createCommentService(
      req.body,
      req.user._id,
      req.params.videoId
    );
    res.status(201).json({
      status: "success",
      data: { comment },
    });
  } catch (error) {
    next(error);
  }
};

const getComment = async (req, res, next) => {
  try {
    const comment = await getCommentByIdService(req.params.id);
    res.status(200).json({
      status: "success",
      data: { comment },
    });
  } catch (error) {
    next(error);
  }
};

const getVideoComments = async (req, res, next) => {
  try {
    const comments = await getVideoCommentsService(req.params.videoId);
    res.status(200).json({
      status: "success",
      results: comments.length,
      data: { comments },
    });
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const comment = await updateCommentService(
      req.params.id,
      req.user._id,
      req.body
    );
    res.status(200).json({
      status: "success",
      data: { comment },
    });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    await deleteCommentService(req.params.id, req.user._id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const restoreComment = async (req, res, next) => {
  try {
    const comment = await restoreCommentService(req.params.id, req.user._id);
    res.status(200).json({
      status: "success",
      data: { comment },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getComment,
  getVideoComments,
  updateComment,
  deleteComment,
  restoreComment,
};
