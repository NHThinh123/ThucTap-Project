const {
  createCommentService,
  //   getListCommentByPostService,
  //   getCommentByIdService,
  //   getReplyByCommentService,
  updateCommentService,
  deleteCommentService,
} = require("../services/comment.service");

const createComment = async (req, res, next) => {
  try {
    const { id, post_id, parent_comment_id, comment_content } = req.body;
    const data = await createCommentService(
      id,
      post_id,
      parent_comment_id,
      comment_content
    );
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

// const getListCommentByPost = async (req, res, next) => {
//   try {
//     const data = await getListCommentByPostService(req.query);
//     res.status(200).json(data);
//   } catch (error) {
//     next(error);
//   }
// };

// const getCommentById = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const data = await getCommentByIdService(id);
//     res.status(200).json(data);
//   } catch (error) {
//     next(error);
//   }
// };

// const getReplyByComment = async (req, res, next) => {
//   try {
//     const data = await getReplyByCommentService(req.query);
//     res.status(200).json(data);
//   } catch (error) {
//     next(error);
//   }
// };

const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dataUpdate = req.body;
    const data = await updateCommentService(id, dataUpdate);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await deleteCommentService(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  //   getListCommentByPost,
  //   getCommentById,
  //   getReplyByComment,
  updateComment,
  deleteComment,
};
