import {
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Button, Divider, Space } from "antd";
import { Bookmark } from "lucide-react";
import { useState } from "react";

const InteractButton = () => {
  const [isClickedLike, setIsClickedLike] = useState(null);
  const [isClickedDislike, setIsClickedDislike] = useState(null);

  const handleClickLike = () => {
    setIsClickedLike(!isClickedLike);
    if (isClickedDislike && !isClickedLike) {
      setIsClickedDislike(false);
    }
  };
  const handleClickDislike = () => {
    setIsClickedDislike(!isClickedDislike);
    if (isClickedLike && !isClickedDislike) {
      setIsClickedLike(false);
    }
  };
  return (
    <Space style={{ float: "right" }}>
      <div
        style={{
          border: "1px solid #d9d9d9",
          borderRadius: 50,
        }}
      >
        <Button
          icon={!isClickedLike ? <LikeOutlined /> : <LikeFilled />}
          style={{
            border: "none",
            boxShadow: "none",
            padding: "0 5px 0 16px",
            fontSize: 23,
          }}
          size="large"
          onClick={handleClickLike}
        >
          <p style={{ fontSize: 16, fontWeight: 500 }}>1,2 N</p>
        </Button>
        <Divider type="vertical" />
        <Button
          icon={!isClickedDislike ? <DislikeOutlined /> : <DislikeFilled />}
          style={{
            border: "none",
            boxShadow: "none",
            padding: "0 16px 0 5px",
            fontSize: 23,
          }}
          size="large"
          onClick={handleClickDislike}
        ></Button>
      </div>
      <div style={{ border: "1px solid #d9d9d9", borderRadius: 50 }}>
        <Button
          icon={<ShareAltOutlined />}
          style={{
            border: "none",
            boxShadow: "none",
            padding: "0 16px 0 16px",
          }}
          size="large"
        >
          <p style={{ fontSize: 16, fontWeight: 500 }}>Chia sẻ</p>
        </Button>
      </div>
      <div style={{ border: "1px solid #d9d9d9", borderRadius: 50 }}>
        <Button
          icon={<Bookmark size={22} strokeWidth={1.75} />}
          style={{
            border: "none",
            boxShadow: "none",
            padding: "0 16px 0 16px",
          }}
          size="large"
        >
          <p style={{ fontSize: 16, fontWeight: 500 }}>Lưu</p>
        </Button>
      </div>
    </Space>
  );
};

export default InteractButton;
