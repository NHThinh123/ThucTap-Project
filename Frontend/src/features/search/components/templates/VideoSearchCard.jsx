import { Link, useNavigate } from "react-router-dom";
import { formatTime } from "../../../../constants/formatTime";
import { formatViews } from "../../../../constants/formatViews";
import { formatDuration } from "../../../../constants/formatDuration";
import { useState } from "react";
import { Avatar, Col, Row } from "antd";

const VideoSearchCard = ({ video }) => {
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/watch/${video._id}`); // Navigate to the video page
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
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
        <Col span={10} style={{ width: "80%", height: "40vh" }}>
          <img
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 10,
            }}
            src={video.thumbnail_video}
            alt={video.title}
          />
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
                  fontSize: 18,
                  fontWeight: 530,
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
            <div
              style={{
                display: "flex",
                fontWeight: 400,
                alignItems: "center",
                gap: 4,
                fontSize: 13,
                color: "#606060",
                marginTop: 4,
              }}
            >
              <span>{formatViews(video.views)} lượt xem</span>
              <span>•</span>
              <span>{formatTime(video.createdAt) || "None date"}</span>
            </div>
            <div style={{ padding: "16px 0" }}>
              <Link to="/channel">
                <Avatar
                  src="https://pbs.twimg.com/media/F_vO2geW0AE1mmW.jpg"
                  size={30}
                />
              </Link>
              <Link to="/channel" style={{ textDecoration: "none" }}>
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: 13,
                    color: "#606060",
                    marginTop: 4,
                    marginLeft: 5,
                  }}
                >
                  {video.user_id.nickname}
                </span>
              </Link>
            </div>
            <div
              style={{
                fontSize: 14,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "#606060",
                fontWeight: 400,
              }}
            >
              {video.description_video}
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
        </Col>
      </Row>
    </div>
  );
};

export default VideoSearchCard;
