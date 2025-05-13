import { CommentOutlined } from "@ant-design/icons";
import { Avatar, Button, List } from "antd";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/skeleton/Title";
import { useState } from "react";

const VideoComment = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "User1",
      content: "Great video!",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    {
      id: 2,
      author: "User2",
      content: "Thanks for sharing!",
      avatar: "https://i.pravatar.cc/40?img=2",
    },
  ]);
  const [newComment, setNewComment] = useState("");
  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          author: "Current User",
          content: newComment,
          avatar: "https://i.pravatar.cc/40?img=3",
        },
      ]);
      setNewComment("");
    }
  };
  return (
    <>
      <div>
        <Title level={4} className="comments-section">
          <CommentOutlined /> {comments.length} Comments
        </Title>
        <div className="comment-input">
          <TextArea
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <Button
            type="primary"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            Comment
          </Button>
        </div>
        <List
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={<p strong>{item.author}</p>}
                description={item.content}
              />
            </List.Item>
          )}
        />
      </div>
    </>
  );
};

export default VideoComment;
