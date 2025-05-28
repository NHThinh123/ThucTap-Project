/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import {
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Button, Divider, Space } from "antd";
import { Bookmark } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../../contexts/modal.context";
import PlaylistModalContent from "../../../playlist/components/templates/PlaylistModalContent";
import { AuthContext } from "../../../../contexts/auth.context";

const InteractButton = ({ videoId, userId }) => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const { openModal } = useModal();
  const [isClickedLike, setIsClickedLike] = useState(null);
  const [isClickedDislike, setIsClickedDislike] = useState(null);

  if (!videoId) {
    console.error("InteractButton: videoId is undefined");
  }
  if (!userId) {
    console.error("InteractButton: userId is undefined");
  }

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

  const handleClickBookmark = () => {
    if (!auth.isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!videoId || !userId) {
      console.error(
        "Không thể mở modal danh sách phát: videoId hoặc userId không hợp lệ",
        { videoId, userId }
      );
      return;
    }
    openModal(<PlaylistModalContent video_id={videoId} user_id={userId} />);
  };

  return (
    <Space style={{ float: "right" }}>
      <div style={{ border: "1px solid #d9d9d9", borderRadius: 50 }}>
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
          onClick={handleClickBookmark}
        >
          <p style={{ fontSize: 16, fontWeight: 500 }}>Lưu</p>
        </Button>
      </div>
    </Space>
  );
};

export default InteractButton;
