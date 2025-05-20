import SingleCommentReply from "../molecules/SingleCommentReply";

const DisplayCommentReply = ({
  replies,
  renderCommentContent,
  handleAddReply,
  toggleCommentExpansion,
  expandedComments,
  level = 1,
}) => {
  return (
    <div style={{ marginLeft: level * 1, marginTop: 8 }}>
      {replies.map((reply) => (
        <SingleCommentReply
          key={reply.id}
          reply={reply}
          renderCommentContent={renderCommentContent}
          handleAddReply={handleAddReply}
          toggleCommentExpansion={toggleCommentExpansion}
          expandedComments={expandedComments}
          level={level}
        />
      ))}
    </div>
  );
};

export default DisplayCommentReply;
