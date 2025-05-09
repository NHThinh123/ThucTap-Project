import React from "react";
import { Card, Avatar, Typography, Space } from "antd";
import { formatTime } from "../constants/formatTime";

const { Text } = Typography;

const VideoCard = ({ video }) => {
  return (
    <Card
      hoverable
      style={{
        width: "100%",
        height: "100%",
        background: "#fff",
        border: "none",
        padding: 0,
      }}
      cover={
        <img
          alt={video.title}
          src={video.thumbnailUrl}
          style={{ height: 250, objectFit: "cover" }}
        />
      }
    >
      <Space align="start">
        <Avatar src={video.channelAvatar} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              margin: 0,
              fontSize: 16,
              display: "-webkit-box",
              WebkitLineClamp: 2, // Sửa từ 1 thành 2 nếu muốn 2 dòng
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {video.title}
          </div>

          <div type="secondary" style={{ display: "block" }}>
            <Text style={{ fontSize: 14 }}>{video.channelName}</Text>
          </div>
          <Space size={4}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {video.views} lượt xem
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              •
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {formatTime(video.createdAt)}
            </Text>
          </Space>
        </div>
      </Space>
    </Card>
  );
};

export default VideoCard;
