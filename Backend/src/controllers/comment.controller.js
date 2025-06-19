const {
  createCommentService,
  getCommentByIdService,
  getVideoCommentsService,
  getReplyCommentsService,
  getVideoCommentsCountService,
  updateCommentService,
  deleteCommentService,
} = require("../services/comment.service");

const createComment = async (req, res, next) => {
  try {
    const { user_id, video_id } = req.body;
    const comment = await createCommentService(req.body, user_id, video_id);
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
    const data = await getVideoCommentsService(req.query);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getReplyComments = async (req, res, next) => {
  try {
    const data = await getReplyCommentsService(req.query);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getVideoCommentsCount = async (req, res, next) => {
  try {
    const data = await getVideoCommentsCountService(req.query);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    const comment = await updateCommentService(
      req.params.id,
      user_id,
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
    const { user_id } = req.body;
    await deleteCommentService(req.params.id, user_id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getComment,
  getVideoComments,
  getReplyComments,
  getVideoCommentsCount,
  updateComment,
  deleteComment,
};
