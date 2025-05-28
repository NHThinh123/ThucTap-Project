import { Avatar, Button, Col, Input, List, Row } from "antd";
import { ChartBarDecreasing } from "lucide-react";
import { useContext, useState } from "react";
import ReplyButton from "../organisms/ReplyButton";
import useVideoComments from "../../hooks/useGetVideoComments";
import { AuthContext } from "../../../../contexts/auth.context";
import useCreateComment from "../../hooks/useCreateComment";
import { formatTime } from "../../../../constants/formatTime";
import CommentRepliesSection from "../organisms/CommentRepliesSection";
import useVideoCommentsCount from "../../hooks/useVideoCommentCount";

const { TextArea } = Input;

const VideoComment = ({ video, isLoading }) => {
  const videoId = video?._id;

  const { auth } = useContext(AuthContext);
  const user_id = auth.isAuthenticated ? auth.user.id : null;

  const [newComment, setNewComment] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [visibleReplies, setVisibleReplies] = useState({});
  const charLimit = 300;

  const { data: commentsData } = useVideoComments(videoId);
  const comments = commentsData || [];

  const { data: commentsCountData } = useVideoCommentsCount(videoId);
  const totalCommentsCount = commentsCountData?.totalCount || 0;

  const createCommentMutation = useCreateComment();

  // Thêm comment mới
  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        await createCommentMutation.mutateAsync({
          comment_content: newComment,
          user_id: user_id,
          video_id: videoId,
        });
        setNewComment("");
        setIsInputFocused(false);
      } catch {
        console.error("Không thể gửi bình luận");
      }
    }
  };

  // Thêm reply mới
  const handleAddReply = async (parentCommentId, replyContent) => {
    if (replyContent.trim()) {
      try {
        await createCommentMutation.mutateAsync({
          comment_content: replyContent,
          user_id: user_id,
          video_id: videoId,
          parent_comment_id: parentCommentId,
        });
        setVisibleReplies((prev) => ({
          ...prev,
          [parentCommentId]: true,
        }));
      } catch {
        console.error("Không thể gửi phản hồi");
      }
    }
  };

  const handleCancel = () => {
    setNewComment("");
    setIsInputFocused(false);
  };

  const toggleCommentExpansion = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const toggleRepliesVisibility = (commentId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const renderCommentContent = (comment) => {
    const isExpanded = expandedComments[comment._id];
    const truncatedContent =
      comment.comment_content.length > charLimit
        ? comment.comment_content.slice(0, charLimit) + "..."
        : comment.comment_content;

    return (
      <span>
        <span style={{ margin: "4px 0 0 0", display: "flex", width: "95%" }}>
          {isExpanded ? comment.comment_content : truncatedContent}
        </span>
        {!isExpanded && comment.comment_content.length > charLimit && (
          <span
            style={{
              color: "#606060",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 520,
              marginTop: 3,
              display: "block",
              width: "fit-content",
            }}
            onClick={() => toggleCommentExpansion(comment._id)}
          >
            Đọc thêm
          </span>
        )}
        {isExpanded && comment.content.length > charLimit && (
          <span
            style={{
              color: "#606060",
              cursor: "pointer",
              display: "block",
              fontSize: 15,
              fontWeight: 520,
              marginTop: 3,
              width: "fit-content",
            }}
            onClick={() => toggleCommentExpansion(comment.id)}
          >
            Ẩn bớt
          </span>
        )}
      </span>
    );
  };
  isLoading && (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <span>Đang tải bình luận...</span>
    </div>
  );

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <h4 style={{ margin: 0, marginRight: 16 }}>
          {totalCommentsCount} bình luận
        </h4>
        <Button
          type="default"
          style={{ fontSize: 14, border: "none", padding: 0 }}
        >
          <ChartBarDecreasing size={25} strokeWidth={1} />
          Sắp xếp theo
        </Button>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <Avatar
          src={
            auth.user.avatar ||
            "https://res.cloudinary.com/nienluan/image/upload/v1747707203/avaMacDinh_jxwsog.jpg"
          }
          size={45}
        />
        <div style={{ flex: 1, position: "relative" }}>
          <TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            autoSize={{ minRows: 1 }}
            placeholder="Viết bình luận..."
            onFocus={() => setIsInputFocused(true)}
            style={{
              padding: "4px 10px",
              fontSize: 14,
              marginTop: 5,
              borderRadius: 12,
            }}
          />
          {isInputFocused && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 8,
              }}
            >
              <Button onClick={handleCancel} style={{ fontSize: 14 }}>
                Hủy
              </Button>
              <Button
                type="primary"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                style={{ fontSize: 14 }}
              >
                Bình luận
              </Button>
            </div>
          )}
        </div>
      </div>
      <List
        bordered={false}
        itemLayout="horizontal"
        dataSource={comments}
        loading={isLoading}
        renderItem={(item) => (
          <List.Item style={{ borderBottom: "none", padding: "8px 0" }}>
            <Row
              gutter={[0, 10]}
              style={{
                width: "100%",
                height: "100%",
                background: "#fff",
                border: "none",
                padding: 0,
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
                  <Avatar src={item.user.avatar} size={45} />
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
                    <span
                      style={{ fontWeight: "bold", margin: 0, fontSize: 14 }}
                    >
                      {item.user.nickname || "Ẩn danh"}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#606060",
                        marginLeft: 8,
                      }}
                    >
                      {formatTime(item.createdAt)}
                    </span>
                  </div>
                  {renderCommentContent(item)}
                  <ReplyButton
                    commentId={item._id}
                    currentUserAvatar={auth.user?.avatar}
                    onAddReply={handleAddReply}
                    onCancelReply={() => {}}
                  />
                  <CommentRepliesSection
                    commentId={item._id}
                    onAddReply={handleAddReply}
                    renderCommentContent={renderCommentContent}
                    toggleCommentExpansion={toggleCommentExpansion}
                    expandedComments={expandedComments}
                    visibleReplies={visibleReplies}
                    toggleRepliesVisibility={toggleRepliesVisibility}
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
                      background: item.isHovered
                        ? "rgb(196, 196, 196)"
                        : "none",
                      border: item.isHovered ? "1px solid black" : "none",
                      borderRadius: item.isHovered ? "50%" : "none",
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
          </List.Item>
        )}
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

export default VideoComment;
