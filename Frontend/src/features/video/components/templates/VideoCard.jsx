import { Link, useNavigate } from "react-router-dom";
import { formatTime } from "../../../../constants/formatTime";
import { formatViews } from "../../../../constants/formatViews";
import { formatDuration } from "../../../../constants/formatDuration";
import { useContext, useEffect, useRef, useState } from "react";
import { useModal } from "../../../../contexts/modal.context";
import { AuthContext } from "../../../../contexts/auth.context";
import PlaylistModalContent from "../../../playlist/components/templates/PlaylistModalContent";
import { message } from "antd";

const VideoCard = ({ video, isShow = true, watchDuration }) => {
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

  const handleCardClick = () => {
    window.location.href = `/watch/${video?._id}`; // Navigate to the video page
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
  };

  const handleLinkClick = (e) => {
    e.stopPropagation(); // Prevent parent onClick from firing
  };
  return (
    <>
      <style>{styles}</style>
      <div className="video-card" onClick={handleCardClick}>
        <div className="video-card__thumbnail-container">
          <img
            className="video-card__cover"
            src={video.thumbnail_video}
            alt={video.title}
          />
          <div className="video-card__duration">
            {formatDuration(video.duration)}
          </div>
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
        </div>
        <div className="video-card__content">
          {isShow && (
            <Link
              to={`/channel/${video?.user_id?._id}`}
              className="video-card__avatar-link"
              onClick={handleLinkClick}
            >
              <img
                className="video-card__avatar"
                src={
                  video?.user_id?.avatar ||
                  "https://res.cloudinary.com/nienluan/image/upload/v1747707203/avaMacDinh_jxwsog.jpg"
                }
                alt="Channel avatar"
              />
            </Link>
          )}
          <div className="video-card__info">
            <div className="video-card__title-container">
              <div className="video-card__title">{video?.title}</div>
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
                    margin: "28px 10px 0 0",
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
            </div>
            {isShow && (
              <Link
                to={`/channel/${video?.user_id?._id}`}
                className="video-card__channel-link"
                onClick={handleLinkClick}
              >
                <span className="video-card__channel">
                  {video?.user_id?.nickname || "Channel Name"}
                </span>
              </Link>
            )}
            <div className="video-card__meta">
              <span>{formatViews(video?.views)} lượt xem</span>
              <span className="dot">•</span>
              <span>{formatTime(video?.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = `
  .video-card {
    width: 100%;
    height: 100%;
    background: #fff;
    cursor: pointer;
    border: none;
    padding: 0;
    overflow: hidden;
    oject-fit: cover;
    object-position: center;
  }

  .video-card__thumbnail-container {
    position: relative;
              border-radius: 10px;
              overflow: hidden;
              oject-fit: cover;
              object-position: center;
              aspect-ratio: 16 / 9;
  }

  .video-card__duration {
    position: absolute;
    bottom: 12px;
    right: 8px;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-family: 'Roboto', Arial, sans-serif;
    font-size: 12px;
    font-weight: 510;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .video-card__cover {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  object-position: center;
  oject-fit: cover;
}

  .video-card__content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding-top: 8px;
  }

  .video-card__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .video-card__info {
    flex: 1;
    min-width: 0;
  }
  .video-card__title-container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }

  .video-card__title {
    font-family: 'Roboto', Arial, sans-serif;
    margin: 0;
    color: #0f0f0f;
    font-size: 17px;
    font-weight: 600;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
  }

  .video-card__more-btn {
    background: none;
    border: none;
    padding: 4px;
    display: flex;
    margin-right: -5px;
    cursor: pointer;
  }

  .video-card__more-btn:hover {
    background:rgb(196, 196, 196);
    border-color: black 1px solid;
    border-radius: 50%;
  }

  .video-card__more-icon {
    width: 20px;
    height: 20px;
    fill: #606060;
  }

  .video-card__channel {
  font-family: 'Roboto', Arial, sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #606060;
  display: inline-block; /* Thay từ display: block */
  white-space: nowrap; /* Ngăn ngắt dòng để chiều dài đúng với nội dung */
}

  .video-card__meta {
  font-family: 'Roboto', Arial, sans-serif;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
  }

  .video-card__meta span {
    font-weight: 400;
    font-size: 14px;
    color: #606060;
  }

  .video-card__meta .dot {
    line-height: 1;
  }
`;

export default VideoCard;
