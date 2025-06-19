import { Link, useNavigate } from "react-router-dom";
import { formatTime } from "../../../../constants/formatTime";
import { formatViews } from "../../../../constants/formatViews";
import { formatDuration } from "../../../../constants/formatDuration";
import { useContext, useEffect, useRef, useState } from "react";
import { Col, message, Row } from "antd";
import { useModal } from "../../../../contexts/modal.context";
import { AuthContext } from "../../../../contexts/auth.context";
import PlaylistModalContent from "../../../playlist/components/templates/PlaylistModalContent";

const VideoSuggestCard = ({ video, watchDuration }) => {
  const { auth } = useContext(AuthContext);
  const { openModal } = useModal();
  const navigate = useNavigate();
  const user_id = auth.isAuthenticated ? auth.user.id : null;
  const video_id = video?._id;
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Lắng nghe custom event để đóng menu
  useEffect(() => {
    const handleCloseAllMenus = (event) => {
      if (event.detail.videoId !== video_id) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("closeAllMenus", handleCloseAllMenus);

    return () => {
      document.removeEventListener("closeAllMenus", handleCloseAllMenus);
    };
  }, [video_id]);

  // Đóng menu khi nhấn ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLinkClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    window.location.href = `/channel/${video?.user_id._id}`;
  };

  const handleRowClick = () => {
    window.location.href = `/watch/${video._id}`; // Navigate to the video page
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
  };
  const handleMenuClick = (e) => {
    e.stopPropagation(); // Prevent row click when clicking the menu button
    const newIsMenuOpen = !isMenuOpen;

    if (newIsMenuOpen) {
      // Dispatch custom event để đóng tất cả menu khác
      const closeAllMenusEvent = new CustomEvent("closeAllMenus", {
        detail: { videoId: video_id },
      });
      document.dispatchEvent(closeAllMenusEvent);
    }

    // Cập nhật trạng thái menu hiện tại
    setIsMenuOpen(newIsMenuOpen);
  };

  const handleMenuAction = (action, e) => {
    e.stopPropagation(); // Prevent row click when clicking a menu item
    setIsMenuOpen(false); // Close menu after action
    switch (action) {
      case "playlists":
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
        openModal(
          <PlaylistModalContent video_id={video_id} user_id={user_id} />
        );
        break;
      case "share": {
        console.log(`Sharing video ${video._id}`);
        const shareUrl = `${window.location.origin}/watch/${video_id}`;
        const shareData = {
          title: "Chia sẻ video",
          url: shareUrl,
        };

        try {
          if (navigator.share) {
            // Sử dụng Web Share API nếu trình duyệt hỗ trợ
            navigator.share(shareData);
            message.success("Chia sẻ video thành công!");
          } else {
            // Fallback: Sao chép link vào clipboard
            navigator.clipboard.writeText(shareUrl);
            message.success("Link video đã được sao chép vào clipboard!");
          }
        } catch (error) {
          console.error("Lỗi khi chia sẻ video:", error);
          message.error("Đã xảy ra lỗi khi chia sẻ video");
        }
        break;
      }
      default:
        break;
    }
  };
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#fff",
        padding: "0 16px 16px",
      }}
    >
      <Row
        gutter={[0, 10]}
        style={{
          background: "#fff",
          cursor: "pointer",
          border: "none",
          padding: 0,
        }}
        onClick={handleRowClick}
      >
        <Col span={10}>
          <div
            style={{
              width: "100%",
              height: 100,
              borderRadius: 10,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              src={video.thumbnail_video}
              alt={video.title}
            />
            {watchDuration !== 0 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: 5,
                  backgroundColor: "red",
                  width: `${Math.min(
                    (watchDuration / video.duration) * 100,
                    100
                  )}%`,
                }}
              />
            )}
            <div
              style={{
                position: "absolute",
                bottom: 5,
                right: 7,
                background: "rgba(0, 0, 0, 0.5)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 540,
                padding: "1px 5px",
                borderRadius: 4,
              }}
            >
              {formatDuration(video.duration)}
            </div>
          </div>
        </Col>
        <Col
          span={13}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            paddingLeft: 8,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  margin: 0,
                  color: "#0f0f0f",
                  fontSize: 15,
                  fontWeight: 600,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: 1.4,
                }}
              >
                {video.title}
              </div>
            </div>
            <Link
              to={`/channel/${video?.user_id?._id}`}
              style={{ textDecoration: "none" }}
              onClick={handleLinkClick}
            >
              <span
                style={{
                  fontWeight: 400,
                  fontSize: 13,
                  color: "#606060",
                  marginTop: 4,
                }}
              >
                {video.user_id?.nickname}
              </span>
            </Link>
            <div
              style={{
                display: "flex",
                fontWeight: 400,
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                color: "#060606",
              }}
            >
              <span>{formatViews(video.views)} lượt xem</span>
              <span>•</span>
              <span>{formatTime(video.createdAt) || "None date"}</span>
            </div>
          </div>
        </Col>
        <Col span={1}>
          <button
            style={{
              background:
                hoveredItemId === video.id ? "rgb(196, 196, 196)" : "none",
              border: hoveredItemId === video.id ? "none" : "none",
              borderRadius: hoveredItemId === video.id ? "50%" : "none",
              padding: 4,
              display: "flex",
              marginRight: -5,
              cursor: "pointer",
            }}
            onMouseEnter={() => setHoveredItemId(video.id)}
            onMouseLeave={() => setHoveredItemId(null)}
            onClick={handleMenuClick}
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
          {isMenuOpen && (
            <div
              ref={menuRef}
              style={{
                position: "absolute",
                marginTop: 5,
                right: 0,
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 4,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                zIndex: 2000,
                width: 240,
                padding: 8,
              }}
            >
              <button
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "#0f0f0f",
                }}
                onClick={(e) => handleMenuAction("playlists", e)}
              >
                Lưu vào danh sách phát
              </button>
              <button
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "#0f0f0f",
                }}
                onClick={(e) => handleMenuAction("share", e)}
              >
                Chia sẻ
              </button>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default VideoSuggestCard;
