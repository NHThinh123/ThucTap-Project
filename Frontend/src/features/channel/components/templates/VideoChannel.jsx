import React from "react";
import { List, Card, Typography } from "antd";

import { mockVideos } from "../../../../data/mockVideos";
import { formatDuration } from "../../../../constants/formatDuration";
import { formatViews } from "../../../../constants/formatViews";
import { formatTime } from "../../../../constants/formatTime";

const { Title, Text } = Typography;

const VideoChannel = () => {
  const videos = mockVideos;
  return (
    <div style={{ padding: "16px" }}>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 4,
          xxl: 4,
        }}
        dataSource={videos}
        renderItem={(item) => (
          <List.Item>
            <Card
              style={{ border: "none", padding: "0" }}
              cover={
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    alt={item.title}
                    src={item.thumbnailUrl}
                    style={{
                      width: "100%",
                      height: "200px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
                  <Text
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "8px",
                      background: "rgba(0, 0, 0, 0.7)",
                      color: "#fff",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  >
                    {formatDuration(item.duration)}
                  </Text>
                </div>
              }
            >
              <Card.Meta
                style={{ padding: 0 }}
                title={
                  <Title level={5} style={{ margin: 0, fontSize: "16px" }}>
                    {item.title}
                  </Title>
                }
                description={
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    {formatViews(item.views)} lượt xem •{" "}
                    {formatTime(item.createdAt)}
                  </Text>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default VideoChannel;
