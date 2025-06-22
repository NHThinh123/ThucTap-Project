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
  sortType,
}) => {
  // Lấy danh sách replies cho comment này
  const { data: repliesData } = useVideoReplyComments(commentId);
  const replies = repliesData || [];

  // Hàm sắp xếp phản hồi
  const sortReplies = (replies) => {
    return [...replies].sort((a, b) => {
      if (sortType === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortType === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortType === "mostCommented") {
        return (b.replyCount || 0) - (a.replyCount || 0);
      }
      return 0;
    });
  };

  const sortedReplies = sortReplies(replies);

  // Chỉ hiển thị nút Show/Hide nếu có replies
  if (sortedReplies?.length === 0) {
    return null;
  }

  return (
    <>
      <ShowHideReplyButton
        replyCount={sortedReplies?.length}
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
          sortType={sortType}
          replies={sortedReplies}
        />
      )}
    </>
  );
};

export default CommentRepliesSection;
