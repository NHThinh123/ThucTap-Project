import { Link, useParams } from "react-router-dom";
import { formatTime } from "../../../../constants/formatTime";
import { formatViews } from "../../../../constants/formatViews";
import { formatDuration } from "../../../../constants/formatDuration";
import { useState } from "react";
import { Col, Row } from "antd";

const PlayListSuggestCard = ({ video, watchDuration, playlist_id }) => {
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { id } = useParams();
  console.log("Playlist ID:", id);

  const handleLinkClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    window.location.href = `/channel/${video?.user_id._id}`;
  };

  const handleRowClick = () => {
    window.location.href = `/playlist/${playlist_id}/${video._id}`; // Navigate to the video page
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
  };
  const handleMenuClick = (e) => {
    e.stopPropagation(); // Prevent row click when clicking the menu button
    setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  };

  const handleMenuAction = (action, e) => {
    e.stopPropagation(); // Prevent row click when clicking a menu item
    setIsMenuOpen(false); // Close menu after action
    switch (action) {
      case "watchLater":
        console.log(`Saved video ${video._id} to Watch Later`);
        // Add logic to save video to watch later
        break;
      case "hide":
        console.log(`Hide video ${video._id}`);
        // Add logic to hide video
        break;
      case "share":
        console.log(`Sharing video ${video._id}`);
        // Add logic to share video
        break;
      case "download":
        console.log(`Downloading video ${video._id}`);
        // Add logic to download video
        break;
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
          cursor: "pointer",
          padding: video._id == id ? 12 : "0 12px",
          border: video._id == id ? "1px solid #c90626" : "none",
          borderRadius: 10,
        }}
        onClick={handleRowClick}
      >
        <Col span={10}>
          <div
            style={{
              width: "100%",
              borderRadius: 10,
              position: "relative",
              overflow: "hidden",
              aspectRatio: "16/9",
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
              border: hoveredItemId === video.id ? "1px solid black" : "none",
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
              style={{
                position: "absolute",
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
                onClick={(e) => handleMenuAction("watchLater", e)}
              >
                Lưu vào danh sách Xem sau
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
                onClick={(e) => handleMenuAction("hide", e)}
              >
                Ẩn video
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
                onClick={(e) => handleMenuAction("download", e)}
              >
                Tải xuống
              </button>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default PlayListSuggestCard;
