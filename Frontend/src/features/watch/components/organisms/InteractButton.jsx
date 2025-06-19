/* eslint-disable no-undef */
import { useContext, useEffect, useState } from "react";
import {
  likeVideoApi,
  unlikeVideoApi,
  getUserLikeStatusApi,
} from "../../services/user_like_videoApi";
import {
  dislikeVideoApi,
  getUserDislikeStatusApi,
  undislikeVideoApi,
} from "../../services/user_dislike_videoApi";
import { AuthContext } from "../../../../contexts/auth.context";
import { useModal } from "../../../../contexts/modal.context";
import { useParams, useNavigate } from "react-router-dom";
import useCountLikeVideo from "../../hooks/useCountLikeVideo";
import { formatLikes } from "../../../../constants/formatLikes";
import { Button, Divider, Space, message } from "antd";
import {
  LikeOutlined,
  LikeFilled,
  DislikeOutlined,
  DislikeFilled,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Bookmark } from "lucide-react";
import PlaylistModalContent from "../../../playlist/components/templates/PlaylistModalContent";

const InteractButton = () => {
  const { id } = useParams();
  const video_id = id;
  const { auth } = useContext(AuthContext);
  const { openModal } = useModal();
  const user_id = auth.isAuthenticated ? auth.user.id : null;
  const { data } = useCountLikeVideo(video_id);
  const [isClickedLike, setIsClickedLike] = useState(false);
  const [isClickedDislike, setIsClickedDislike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const navigate = useNavigate();

  // Cập nhật likeCount khi data từ API thay đổi
  useEffect(() => {
    if (data !== undefined) {
      setLikeCount(data); // Giả sử API trả về { count: number }
    }
  }, [data]);

  // Fetch initial like count
  useEffect(() => {
    const fetchUserLikeStatus = async () => {
      if (!user_id) return;
      try {
        const response = await getUserLikeStatusApi({ user_id, video_id });
        setIsClickedLike(response.data || false);
      } catch (error) {
        console.error("Lỗi khi lấy trạng thái thích:", error);
      }
    };

    const fetchUserDislikeStatus = async () => {
      if (!user_id) return;
      try {
        const response = await getUserDislikeStatusApi({ user_id, video_id });
        setIsClickedDislike(response.data || false);
      } catch (error) {
        console.error("Lỗi khi lấy trạng thái không thích:", error);
      }
    };
    fetchUserLikeStatus();
    fetchUserDislikeStatus();
  }, [video_id, user_id]);

  const handleClickLike = async () => {
    if (!user_id) {
      console.error("Người dùng chưa đăng nhập");
      return;
    }
    try {
      if (isClickedLike) {
        await unlikeVideoApi({ user_id, video_id });
        setLikeCount((prev) => prev - 1);
        setIsClickedLike(false);
      } else {
        await likeVideoApi({ user_id, video_id });
        setLikeCount((prev) => prev + 1);
        setIsClickedLike(true);
        if (isClickedDislike) {
          setIsClickedDislike(false);
        }
      }
    } catch (error) {
      console.error("Hành động thích thất bại:", error);
    }
  };

  const handleClickDislike = async () => {
    if (!user_id) {
      console.error("Người dùng chưa đăng nhập");
      return;
    }
    try {
      if (isClickedDislike) {
        await undislikeVideoApi({ user_id, video_id });
        setIsClickedDislike(false);
      } else {
        await dislikeVideoApi({ user_id, video_id });
        setIsClickedDislike(true);
        if (isClickedLike) {
          setLikeCount((prev) => prev - 1);
          setIsClickedLike(false);
        }
      }
    } catch (error) {
      console.error("Hành động không thích thất bại:", error);
    }
  };

  const handleClickBookmark = () => {
    console.log("Bookmark button clicked");
    if (!auth.isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!video_id || !user_id) {
      console.error(
        "Không thể mở modal danh sách phát: videoId hoặc userId không hợp lệ",
        { video_id, user_id }
      );
      return;
    }
    console.log("Opening modal with PlaylistModalContent");
    openModal(<PlaylistModalContent video_id={video_id} user_id={user_id} />);
  };

  const handleClickShare = async () => {
    const shareUrl = `${window.location.origin}/watch/${video_id}`;
    const shareData = {
      title: "Chia sẻ video",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        // Sử dụng Web Share API nếu trình duyệt hỗ trợ
        await navigator.share(shareData);
        message.success("Chia sẻ video thành công!");
      } else {
        // Fallback: Sao chép link vào clipboard
        await navigator.clipboard.writeText(shareUrl);
        message.success("Link video đã được sao chép vào clipboard!");
      }
    } catch (error) {
      console.error("Lỗi khi chia sẻ video:", error);
      message.error("Đã xảy ra lỗi khi chia sẻ video");
    }
  };

  return (
    <Space>
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
          {likeCount > 0 && (
            <p style={{ fontSize: 16, fontWeight: 500 }}>
              {formatLikes(likeCount.toLocaleString())}
            </p>
          )}
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
          onClick={handleClickShare}
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
