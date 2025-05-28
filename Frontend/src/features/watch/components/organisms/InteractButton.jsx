/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
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
import { useParams } from "react-router-dom";
import useCountLikeVideo from "../../hooks/useCountLikeVideo";
import { formatLikes } from "../../../../constants/formatLikes";

const InteractButton = () => {
  const { id } = useParams();
  const video_id = id;
  const { auth } = useContext(AuthContext);
  const user_id = auth.isAuthenticated ? auth.user.id : null;
  const { data } = useCountLikeVideo(video_id);
  console.log("data", data);
  const [isClickedLike, setIsClickedLike] = useState(false);
  const [isClickedDislike, setIsClickedDislike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Cập nhật likeCount khi data từ API thay đổi
  useEffect(() => {
    if (data !== undefined) {
      setLikeCount(data); // Giả sử API trả về { count: number }
    }
  }, [data]);

  // Fetch initial like count
  useEffect(() => {
    // Lấy trạng thái thích của người dùng
    const fetchUserLikeStatus = async () => {
      if (!user_id) return; // Bỏ qua nếu người dùng chưa đăng nhập
      try {
        const response = await getUserLikeStatusApi({ user_id, video_id });
        setIsClickedLike(response.data || false);
      } catch (error) {
        console.error("Lỗi khi lấy trạng thái thích:", error);
      }
    };

    // Lấy trạng thái không thích của người dùng
    const fetchUserDislikeStatus = async () => {
      if (!user_id) return; // Bỏ qua nếu người dùng chưa đăng nhập
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
        // Nếu đã nhấn like và nhấn lại, gọi unlike
        await unlikeVideoApi({ user_id, video_id });
        setLikeCount((prev) => prev - 1);
        setIsClickedLike(false);
      } else {
        // Nếu chưa nhấn like, gọi like
        await likeVideoApi({ user_id, video_id });
        setLikeCount((prev) => prev + 1);
        setIsClickedLike(true);
        // Nếu đã nhấn dislike trước đó, chỉ cần cập nhật trạng thái dislike
        if (isClickedDislike) {
          setIsClickedDislike(false); // Không gọi undislikeVideoApi
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
        // Nếu đã nhấn dislike và nhấn lại, gọi undislike
        await undislikeVideoApi({ user_id, video_id });
        setIsClickedDislike(false);
      } else {
        // Nếu chưa nhấn dislike, gọi dislike
        await dislikeVideoApi({ user_id, video_id });
        setIsClickedDislike(true);
        // Nếu đã nhấn like trước đó, chỉ cần cập nhật trạng thái like
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
