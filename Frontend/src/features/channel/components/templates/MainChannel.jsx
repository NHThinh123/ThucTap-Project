import { Col, Divider, Row, Typography } from "antd";
import React, { useContext } from "react";
import HorizontalListVideo from "../organisms/HorizontalListVideo";
import useVideosByUserId from "../../../video/hooks/useVideosByUserId";
import { formatViews } from "../../../../constants/formatViews";
import { formatTime } from "../../../../constants/formatTime";
import { Link } from "react-router-dom";
import { formatDuration } from "../../../../constants/formatDuration";
import { AuthContext } from "../../../../contexts/auth.context";
import useHistory from "../../../history/hooks/useHistory";

const { Title, Text } = Typography;

const MainChannel = ({ channelId }) => {
  const { auth } = useContext(AuthContext);
  const { HistoryData, isLoading: isLoadingHistory } = useHistory(
    auth?.user?.id
  );
  const { videoList, isLoading, isError, error } = useVideosByUserId(channelId);

  // Hàm tìm watch_duration từ HistoryData theo video.id
  const getWatchDuration = (videoId) => {
    if (!HistoryData?.data?.histories) return 0;

    for (const history of HistoryData.data.histories) {
      for (const vid of history.videos) {
        if (vid?.video_id?._id === videoId) {
          return vid.watch_duration;
        }
      }
    }
    return 0;
  };

  // Lấy video mới nhất
  const latestVideo =
    videoList.length > 0
      ? [...videoList].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0]
      : null;

  // Sắp xếp video cho các section
  const latestVideos = [...videoList].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  ); // Sắp xếp theo ngày tạo (mới nhất)
  const popularVideos = [...videoList].sort((a, b) => b.views - a.views); // Sắp xếp theo lượt xem (phổ biến)

  const watchDurationLatestVideo = getWatchDuration(latestVideo?._id);

  if (isLoading && isLoadingHistory) {
    return <div>Đang tải video...</div>;
  }

  if (isError) {
    return <div>Lỗi: {error?.message || "Không thể tải video"}</div>;
  }

  return (
    <>
      <style>{styles}</style>
      <Divider style={{ marginTop: "-16px" }} />
      <Row align={"top"} gutter={16}>
        <Col>
          <Link
            to={latestVideo ? `/watch/${latestVideo._id}` : "#"}
            onClick={(e) => {
              e.preventDefault();
              latestVideo
                ? (window.location.href = `/watch/${latestVideo._id}`)
                : (window.location.href = "#");
            }}
          >
            <div
              style={{
                position: "relative",
                width: "420px",
                height: "230px",
                borderRadius: 10,
                overflow: "hidden",
                objectFit: "cover",
              }}
            >
              <img
                src={latestVideo?.thumbnail_video}
                alt={latestVideo?.title}
                style={{
                  width: "420px",
                  height: "230px",
                  borderRadius: "8px",
                  objectFit: "cover",
                  overflow: "hidden",
                }}
              />
              <div className="video-card__duration">
                {formatDuration(latestVideo?.duration)}
              </div>
              {watchDurationLatestVideo !== 0 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: 6,
                    backgroundColor: "red",
                    width: `${Math.min(
                      (watchDurationLatestVideo / latestVideo?.duration) * 100,
                      100
                    )}%`,
                  }}
                />
              )}
            </div>
          </Link>
        </Col>
        <Col span={9}>
          <p
            style={{
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            <Link
              to={latestVideo ? `/watch/${latestVideo._id}` : "#"}
              onClick={(e) => {
                e.preventDefault();
                latestVideo
                  ? (window.location.href = `/watch/${latestVideo._id}`)
                  : (window.location.href = "#");
              }}
            >
              <span
                style={{
                  fontWeight: "700",
                  color: "#0f0f0f",
                  fontSize: 16,
                }}
              >
                {latestVideo?.title || "Tiêu đề video"}
              </span>
            </Link>
          </p>
          <Text style={{ fontSize: 13, marginTop: 10, color: "#606060" }}>
            {formatViews(latestVideo?.views)} lượt xem •{" "}
            {formatTime(latestVideo?.createdAt)}
          </Text>
          <p
            style={{
              marginTop: "10px",
              display: "-webkit-box",
              WebkitLineClamp: 6,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: 14,
            }}
          >
            {latestVideo?.description_video}
          </p>
        </Col>
        <Col span={5}></Col>
      </Row>

      <Divider />
      <Title level={3}>Video mới nhất</Title>
      <Row style={{ marginTop: "16px" }}>
        <Col span={24}>
          <HorizontalListVideo videos={latestVideos} />
        </Col>
      </Row>
      <Divider />
      <Title level={3}>Video phổ biến</Title>
      <Row style={{ marginTop: "16px" }}>
        <Col span={24}>
          <HorizontalListVideo videos={popularVideos} />
        </Col>
      </Row>
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
  }

  .video-card__thumbnail-container {
    position: relative;
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
  border-radius: 10px;
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
export default MainChannel;
