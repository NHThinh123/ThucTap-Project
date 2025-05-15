import { Avatar, Col, Row } from "antd";
import { useEffect, useState } from "react";
import ReplyButton from "../organisms/ReplyButton";
import DisplayCommentReply from "../organisms/DisplayCommentReply";
import ShowHideReplyButton from "../organisms/ShowHideReplyButton";

const SingleCommentReply = ({
  reply,
  renderCommentContent,
  handleAddReply,
  toggleCommentExpansion,
  expandedComments,
  level,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRepliesExpanded, setIsRepliesExpanded] = useState(false);

  // Tự động mở danh sách phản hồi khi có phản hồi mới
  useEffect(() => {
    if (reply.replies.length > 0) {
      setIsRepliesExpanded(true);
    }
  }, [reply.replies.length]);

  const handleReplySubmit = (commentId, content) => {
    handleAddReply(commentId, content, reply);
    setIsRepliesExpanded(true); // Đảm bảo danh sách phản hồi mở sau khi thêm
  };

  return (
    <Row
      key={reply.id}
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
          <Avatar src={reply.avatar} size={32} />
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
              {reply.author}
            </span>
            <span
              style={{
                fontSize: 12,
                color: "#606060",
                marginLeft: 8,
              }}
            >
              1 giờ trước
            </span>
          </div>
          {renderCommentContent(reply)}
          <ReplyButton
            commentId={reply.id}
            currentUserAvatar="https://i.pravatar.cc/40?img=3"
            onAddReply={handleReplySubmit}
            onCancelReply={() => {}}
          />
          {reply.replies.length > 0 && (
            <ShowHideReplyButton
              replyCount={reply.replies.length}
              onToggle={() => setIsRepliesExpanded(!isRepliesExpanded)}
              isExpanded={isRepliesExpanded}
            />
          )}
          {isRepliesExpanded && (
            <DisplayCommentReply
              replies={reply.replies}
              renderCommentContent={renderCommentContent}
              handleAddReply={handleAddReply}
              toggleCommentExpansion={toggleCommentExpansion}
              expandedComments={expandedComments}
              level={level + 1}
            />
          )}
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
              background: isHovered ? "rgb(196, 196, 196)" : "none",
              border: isHovered ? "1px solid black" : "none",
              borderRadius: isHovered ? "50%" : "none",
              padding: 4,
              display: "flex",
              cursor: "pointer",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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
};

export default SingleCommentReply;
