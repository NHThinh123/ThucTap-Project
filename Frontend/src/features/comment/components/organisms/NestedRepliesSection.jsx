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
  sortType,
}) => {
  // Lấy danh sách nested replies cho reply này
  const { data: nestedRepliesData } = useVideoReplyComments(replyId);
  const nestedReplies = nestedRepliesData || [];

  // Hàm sắp xếp phản hồi lồng nhau
  const sortNestedReplies = (replies) => {
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

  const sortedNestedReplies = sortNestedReplies(nestedReplies);

  // Chỉ hiển thị nếu có nested replies
  if (sortedNestedReplies?.length === 0) {
    return null;
  }

  return (
    <>
      <ShowHideReplyButton
        replyCount={sortedNestedReplies?.length}
        onToggle={() => toggleNestedRepliesVisibility(replyId)}
        isExpanded={visibleNestedReplies[replyId]}
      />

      {visibleNestedReplies[replyId] && (
        <DisplayCommentReply
          renderCommentContent={renderCommentContent}
          handleAddReply={handleAddReply}
          toggleCommentExpansion={toggleCommentExpansion}
          expandedComments={expandedComments}
          level={level + 1}
          sortType={sortType}
          replies={sortedNestedReplies}
        />
      )}
    </>
  );
};

export default NestedRepliesSection;
