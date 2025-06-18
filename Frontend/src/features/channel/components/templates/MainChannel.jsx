import { Col, Divider, Row, Typography } from "antd";
import React from "react";
import HorizontalListVideo from "../organisms/HorizontalListVideo";
import useVideosByUserId from "../../../video/hooks/useVideosByUserId";
import { formatViews } from "../../../../constants/formatViews";
import { formatTime } from "../../../../constants/formatTime";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const MainChannel = ({ channelId }) => {
  const { videoList, isLoading, isError, error } = useVideosByUserId(channelId);

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

  if (isLoading) {
    return <div>Đang tải video...</div>;
  }

  if (isError) {
    return <div>Lỗi: {error?.message || "Không thể tải video"}</div>;
  }

  return (
    <>
      <Divider style={{ marginTop: "-16px" }} />
      <Row align={"top"} gutter={16}>
        <Col span={10}>
          <Link
            to={latestVideo ? `/watch/${latestVideo._id}` : "#"}
            onClick={(e) => {
              e.preventDefault();
              latestVideo
                ? (window.location.href = `/watch/${latestVideo._id}`)
                : (window.location.href = "#");
            }}
          >
            <img
              src={latestVideo?.thumbnail_video}
              alt={latestVideo?.title}
              style={{ width: "420px", height: "230px", borderRadius: "8px" }}
            />
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
          <Text style={{ fontSize: 13, marginTop: 10 }}>
            {formatViews(latestVideo.views)} lượt xem •{" "}
            {formatTime(latestVideo.createdAt)}
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

export default MainChannel;
