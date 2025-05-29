import ShowHideReplyButton from "../organisms/ShowHideReplyButton";
import DisplayCommentReply from "../organisms/DisplayCommentReply";
import useVideoReplyComments from "../../hooks/useGetReplyComment";

const CommentRepliesSection = ({
  commentId,
  onAddReply,
  renderCommentContent,
  toggleCommentExpansion,
  expandedComments,
  visibleReplies,
  toggleRepliesVisibility,
}) => {
  // Lấy danh sách replies cho comment này
  const { data: repliesData } = useVideoReplyComments(commentId);
  const replies = repliesData || [];

  // Chỉ hiển thị nút Show/Hide nếu có replies
  if (replies.length === 0) {
    return null;
  }

  return (
    <>
      <ShowHideReplyButton
        replyCount={replies.length}
        onToggle={() => toggleRepliesVisibility(commentId)}
        isExpanded={visibleReplies[commentId]}
      />
      {visibleReplies[commentId] && (
        <DisplayCommentReply
          commentId={commentId}
          renderCommentContent={renderCommentContent}
          handleAddReply={onAddReply}
          toggleCommentExpansion={toggleCommentExpansion}
          expandedComments={expandedComments}
        />
      )}
    </>
  );
};

export default CommentRepliesSection;
