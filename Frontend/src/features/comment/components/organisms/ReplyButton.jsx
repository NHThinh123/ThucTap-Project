import { Avatar, Button, Input } from "antd";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../contexts/auth.context";

const { TextArea } = Input;

const ReplyButton = ({
  commentId,
  currentUserAvatar,
  onAddReply,
  onCancelReply,
}) => {
  const { auth } = useContext(AuthContext);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  // Không hiển thị nút reply nếu user chưa đăng nhập
  if (!auth.isAuthenticated) {
    return null;
  }

  const handleAddReply = () => {
    if (replyContent.trim()) {
      onAddReply(commentId, replyContent);
      setReplyContent("");
      setIsReplying(false);
    }
  };

  const handleCancel = () => {
    setReplyContent("");
    setIsReplying(false);
    onCancelReply();
  };

  return (
    <div>
      <Button
        type="link"
        style={{
          padding: 0,
          marginTop: 10,
          fontSize: 14,
          height: "auto",
          color: "#000",
        }}
        onClick={() => setIsReplying(true)}
      >
        Phản hồi
      </Button>
      {isReplying && (
        <div
          style={{
            marginTop: 8,
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
          }}
        >
          <Avatar
            src={
              currentUserAvatar ||
              auth.user?.avatar ||
              "https://res.cloudinary.com/nienluan/image/upload/v1747707203/avaMacDinh_jxwsog.jpg"
            }
            size={32}
          />
          <div style={{ flex: 1 }}>
            <TextArea
              autoSize={{ minRows: 1 }}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Viết phản hồi..."
              style={{
                padding: "4px 10px",
                fontSize: 14,
                borderRadius: 12,
              }}
            />
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
                onClick={handleAddReply}
                disabled={!replyContent.trim()}
                style={{ fontSize: 14 }}
              >
                Phản hồi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplyButton;
