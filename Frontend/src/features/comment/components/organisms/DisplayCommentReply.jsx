import { Avatar, Col, Row } from "antd";
import { useContext, useState } from "react";
import ReplyButton from "../organisms/ReplyButton";
import NestedRepliesSection from "../organisms/NestedRepliesSection";
import { formatTime } from "../../../../constants/formatTime";
import { AuthContext } from "../../../../contexts/auth.context";
import useVideoReplyComments from "../../hooks/useGetReplyComment";

const DisplayCommentReply = ({
  commentId,
  renderCommentContent,
  handleAddReply,
  toggleCommentExpansion,
  expandedComments,
  level = 1,
}) => {
  const { auth } = useContext(AuthContext);
  const [visibleNestedReplies, setVisibleNestedReplies] = useState({});

  // Lấy danh sách reply cho comment hiện tại
  const { data: repliesData } = useVideoReplyComments(commentId);
  const replies = repliesData || [];

  const toggleNestedRepliesVisibility = (replyId) => {
    setVisibleNestedReplies((prev) => ({
      ...prev,
      [replyId]: !prev[replyId],
    }));
  };

  const handleNestedReplySubmit = (parentReplyId, content) => {
    handleAddReply(parentReplyId, content);
    setVisibleNestedReplies((prev) => ({
      ...prev,
      [parentReplyId]: true,
    }));
  };

  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div style={{ marginLeft: level * 20, marginTop: 8 }}>
      {replies.map((reply) => {
        return (
          <Row
            key={reply._id}
            gutter={[0, 10]}
            style={{
              background: "#fff",
              border: "none",
              padding: 0,
              marginBottom: 8,
            }}
          >
            <Col
              span={24}
              style={{
                fontSize: 14,
                display: "flex",
                gap: 8,
                width: "100%",
                position: "relative",
              }}
            >
              <div style={{ flex: "0 0 auto" }}>
                <Avatar src={reply.user.avatar} size={32} />
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: 6,
                }}
              >
                <div>
                  <span style={{ fontWeight: "bold", margin: 0, fontSize: 14 }}>
                    {reply.user.nickname || "Ẩn danh"}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "#606060",
                      marginLeft: 8,
                    }}
                  >
                    {formatTime(reply.createdAt)}
                  </span>
                </div>
                {renderCommentContent(reply)}

                {auth.isAuthenticated && (
                  <ReplyButton
                    commentId={reply._id}
                    currentUserAvatar={auth.user?.avatar}
                    onAddReply={handleNestedReplySubmit}
                    onCancelReply={() => {}}
                  />
                )}

                <NestedRepliesSection
                  replyId={reply._id}
                  visibleNestedReplies={visibleNestedReplies}
                  toggleNestedRepliesVisibility={toggleNestedRepliesVisibility}
                  renderCommentContent={renderCommentContent}
                  handleAddReply={handleAddReply}
                  toggleCommentExpansion={toggleCommentExpansion}
                  expandedComments={expandedComments}
                  level={level}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              >
                <button
                  style={{
                    background: "none",
                    border: "none",
                    borderRadius: "50%",
                    padding: 4,
                    display: "flex",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgb(196, 196, 196)";
                    e.target.style.border = "1px solid black";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "none";
                    e.target.style.border = "none";
                  }}
                  aria-label="More options"
                >
                  <svg
                    style={{ width: 20, height: 20 }}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </Col>
          </Row>
        );
      })}
    </div>
  );
};

export default DisplayCommentReply;
