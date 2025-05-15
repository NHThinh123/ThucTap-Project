import { Avatar, Button, Col, Input, List, Row } from "antd";
import { ChartBarDecreasing } from "lucide-react";
import { useState } from "react";
import ReplyButton from "../organisms/ReplyButton";
import DisplayCommentReply from "../organisms/DisplayCommentReply";
import ShowHideReplyButton from "../organisms/ShowHideReplyButton";

const { TextArea } = Input;

// Hàm tạo ID duy nhất
const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const VideoComment = () => {
  const [comments, setComments] = useState([
    {
      id: generateUniqueId(),
      author: "User1",
      content: "Great video!",
      avatar: "https://i.pravatar.cc/40?img=1",
      replies: [],
    },
    {
      id: generateUniqueId(),
      author: "User2",
      content:
        "This is the video description. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.".repeat(
          7
        ),
      avatar: "https://i.pravatar.cc/40?img=2",
      replies: [
        {
          id: generateUniqueId(),
          author: "Current User",
          content: "Nice description!",
          avatar: "https://i.pravatar.cc/40?img=3",
          replies: [],
        },
      ],
    },
  ]);
  const [newComment, setNewComment] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [visibleReplies, setVisibleReplies] = useState({});
  const charLimit = 300;

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: generateUniqueId(),
          author: "Current User",
          content: newComment,
          avatar: "https://i.pravatar.cc/40?img=3",
          replies: [],
        },
      ]);
      setNewComment("");
      setIsInputFocused(false);
    }
  };

  const handleCancel = () => {
    setNewComment("");
    setIsInputFocused(false);
  };

  const handleAddReply = (commentId, content, parentComment = null) => {
    if (content.trim()) {
      const newReply = {
        id: generateUniqueId(),
        author: "Current User",
        content: content,
        avatar: "https://i.pravatar.cc/40?img=3",
        replies: [],
      };

      const updateReplies = (items) => {
        return items.map((item) => {
          if (item.id === commentId) {
            return { ...item, replies: [...item.replies, newReply] };
          }
          return { ...item, replies: updateReplies(item.replies) };
        });
      };

      if (parentComment) {
        setComments(updateReplies(comments));
        setVisibleReplies((prev) => ({
          ...prev,
          [parentComment.id]: true,
        }));
      } else {
        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, replies: [...comment.replies, newReply] }
              : comment
          )
        );
        setVisibleReplies((prev) => ({
          ...prev,
          [commentId]: true,
        }));
      }
    }
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
    const isExpanded = expandedComments[comment.id];
    const truncatedContent =
      comment.content.length > charLimit
        ? comment.content.slice(0, charLimit) + "..."
        : comment.content;

    return (
      <span>
        <span style={{ margin: "4px 0 0 0", display: "flex", width: "95%" }}>
          {isExpanded ? comment.content : truncatedContent}
        </span>
        {!isExpanded && comment.content.length > charLimit && (
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
            onClick={() => toggleCommentExpansion(comment.id)}
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

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <h4 style={{ margin: 0, marginRight: 16 }}>
          {comments.length} bình luận
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
        <Avatar src="https://i.pravatar.cc/40?img=3" size={45} />
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
                  <Avatar src={item.avatar} size={45} />
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
                      {item.author}
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
                  {renderCommentContent(item)}
                  <ReplyButton
                    commentId={item.id}
                    currentUserAvatar="https://i.pravatar.cc/40?img=3"
                    onAddReply={handleAddReply}
                    onCancelReply={() => {}}
                  />
                  {item.replies.length > 0 && (
                    <ShowHideReplyButton
                      replyCount={item.replies.length}
                      onToggle={() => toggleRepliesVisibility(item.id)}
                      isExpanded={visibleReplies[item.id]}
                    />
                  )}
                  {visibleReplies[item.id] && (
                    <DisplayCommentReply
                      replies={item.replies}
                      renderCommentContent={renderCommentContent}
                      handleAddReply={handleAddReply}
                      toggleCommentExpansion={toggleCommentExpansion}
                      expandedComments={expandedComments}
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
                      background: item.isHovered
                        ? "rgb(196, 196, 196)"
                        : "none",
                      border: item.isHovered ? "1px solid black" : "none",
                      borderRadius: item.isHovered ? "50%" : "none",
                      padding: 4,
                      display: "flex",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() =>
                      setComments(
                        comments.map((c) =>
                          c.id === item.id ? { ...c, isHovered: true } : c
                        )
                      )
                    }
                    onMouseLeave={() =>
                      setComments(
                        comments.map((c) =>
                          c.id === item.id ? { ...c, isHovered: false } : c
                        )
                      )
                    }
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
