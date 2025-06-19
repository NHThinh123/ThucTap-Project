import { Link } from "react-router-dom";
import { formatTime } from "../../../../constants/formatTime";
import { formatViews } from "../../../../constants/formatViews";
import { formatDuration } from "../../../../constants/formatDuration";
import { Avatar, Col, Row } from "antd";

const VideoCardHistory = ({ video, watchDuration }) => {
  const handleCardClick = () => {
    window.location.href = `/watch/${video._id}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLinkClick = (e) => {
    e.stopPropagation(); // tránh trigger navigate khi click vào link
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#fff",
        padding: 0,
      }}
    >
      <Row
        gutter={[0, 10]}
        style={{
          background: "#fff",
          cursor: "pointer",
          border: "none",
          padding: 0,
          marginBottom: "1rem",
        }}
        onClick={handleCardClick}
      >
        <Col span={10} style={{ width: "80%", height: "20vh" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: 10,
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
              <span>{formatTime(video.createdAt)}</span>
            </div>
            <div style={{ padding: "16px 0" }}>
              <Link
                to={`/channel/${video?.user_id?._id}`}
                onClick={handleLinkClick}
              >
                <Avatar
                  src={
                    video.user_id?.avatar ||
                    `https://res.cloudinary.com/nienluan/image/upload/v1746760288/images/lsdixzyj0wqya3yutjy4.jpg`
                  }
                  size={30}
                />
              </Link>
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
                    marginLeft: 5,
                  }}
                >
                  {video.user_id?.nickname}
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
      </Row>
    </div>
  );
};

export default VideoCardHistory;
