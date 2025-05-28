import ShowHideReplyButton from "../organisms/ShowHideReplyButton";
import DisplayCommentReply from "../organisms/DisplayCommentReply";
import useVideoReplyComments from "../../hooks/useGetReplyComment";

const NestedRepliesSection = ({
  replyId,
  visibleNestedReplies,
  toggleNestedRepliesVisibility,
  renderCommentContent,
  handleAddReply,
  toggleCommentExpansion,
  expandedComments,
  level,
}) => {
  // Lấy danh sách nested replies cho reply này
  const { data: nestedRepliesData } = useVideoReplyComments(replyId);
  const nestedReplies = nestedRepliesData || [];

  // Chỉ hiển thị nếu có nested replies
  if (nestedReplies.length === 0) {
    return null;
  }

  return (
    <>
      <ShowHideReplyButton
        replyCount={nestedReplies.length}
        onToggle={() => toggleNestedRepliesVisibility(replyId)}
        isExpanded={visibleNestedReplies[replyId]}
      />

      {visibleNestedReplies[replyId] && (
        <DisplayCommentReply
          commentId={replyId}
          renderCommentContent={renderCommentContent}
          handleAddReply={handleAddReply}
          toggleCommentExpansion={toggleCommentExpansion}
          expandedComments={expandedComments}
          level={level + 1}
        />
      )}
    </>
  );
};

export default NestedRepliesSection;
