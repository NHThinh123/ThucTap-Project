import { Link } from "react-router-dom";
import { formatTime } from "../../../../constants/formatTime";
import { formatViews } from "../../../../constants/formatViews";
import { formatDuration } from "../../../../constants/formatDuration";
import { useEffect, useState } from "react";
import { Avatar, Col, Row } from "antd";

const VideoSearchCard = ({ video, watchDuration }) => {
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [dimensions, setDimensions] = useState({
    fontsizeViewNickname: 13,
    fontsizeDescrip: 14,
    sizeAvatar: 30,
    fontsizeTitle: 18,
    padding: "16px 0",
  });

  // Cập nhật kích thước dựa trên kích thước màn hình
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const breakpoints = {
        xs: 576,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1600,
      };

      if (width < breakpoints.sm) {
        // xs
        setDimensions({
          fontsizeViewNickname: 10,
          fontsizeDescrip: 11,
          sizeAvatar: 26,
          fontsizeTitle: 14,
          padding: "3px 0",
        });
      } else if (width < breakpoints.md) {
        // sm
        setDimensions({
          fontsizeViewNickname: 12,
          fontsizeDescrip: 13,
          sizeAvatar: 28,
          fontsizeTitle: 16,
          padding: "7px 0",
        });
      } else if (width < breakpoints.lg) {
        // md
        setDimensions({
          fontsizeViewNickname: 13,
          fontsizeDescrip: 14,
          sizeAvatar: 30,
          fontsizeTitle: 18,
          padding: "10px 0",
        });
      } else if (width < breakpoints.xl) {
        // lg
        setDimensions({
          fontsizeViewNickname: 12,
          fontsizeDescrip: 13,
          sizeAvatar: 28,
          fontsizeTitle: 16,
          padding: "15px 0",
        });
      } else if (width < breakpoints.xxl) {
        // xl
        setDimensions({
          fontsizeViewNickname: 13,
          fontsizeDescrip: 14,
          sizeAvatar: 30,
          fontsizeTitle: 18,
          padding: "16px 0",
        });
      } else {
        // xxl
        setDimensions({
          fontsizeViewNickname: 13,
          fontsizeDescrip: 14,
          sizeAvatar: 30,
          fontsizeTitle: 18,
          padding: "16px 0",
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleRowClick = () => {
    window.location.href = `/watch/${video._id}`; // Navigate to the video page
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
  };

  const handleLinkClick = (e) => {
    e.stopPropagation(); // Prevent parent onClick from firing
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
        <Col
          span={9}
          style={{
            width: "100%",
            aspectRatio: "16/9",
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
              borderRadius: 10,
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
        </Col>
        <Col
          span={14}
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
                  fontSize: dimensions.fontsizeTitle,
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
                fontSize: dimensions.fontsizeViewNickname,
                color: "#606060",
                marginTop: 4,
              }}
            >
              <span>{formatViews(video.views)} lượt xem</span>
              <span>•</span>
              <span>{formatTime(video.createdAt) || "None date"}</span>
            </div>
            <div style={{ padding: dimensions.padding }}>
              <Link
                to={`/channel/${video?.user_id._id}`}
                onClick={handleLinkClick}
              >
                <Avatar
                  src="https://pbs.twimg.com/media/F_vO2geW0AE1mmW.jpg"
                  size={dimensions.sizeAvatar}
                />
              </Link>
              <Link
                to={`/channel/${video?.user_id._id}`}
                style={{ textDecoration: "none" }}
                onClick={handleLinkClick}
              >
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: dimensions.fontsizeViewNickname,
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
                fontSize: dimensions.fontsizeDescrip,
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
