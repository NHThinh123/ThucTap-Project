import React from "react";
import BoxCustom from "../../../../components/atoms/BoxCustom";
import {
  Button,
  Col,
  Divider,
  List,
  Row,
  Space,
  Typography,
  Spin,
  message,
} from "antd";
import { ChartNoAxesColumn, ThumbsDown, ThumbsUp } from "lucide-react";
import { useUserVideos } from "../../hooks/useUserVideos";
import { formatViews } from "../../../../constants/formatViews";

const VideoPublish = ({ userId }) => {
  const { data: videos, isLoading, error } = useUserVideos(userId);

  const data =
    videos?.slice(0, 3).map((video) => ({
      thumbnail: video.thumbnail_video,
      title: video.title,
      view: formatViews(video.views),
      likes: video.likes,
      dislikes: video.dislikes,
    })) || [];

  if (isLoading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
    );
  }

  if (error) {
    message.open({
      type: "error",
      content: error.message || "Lỗi khi tải danh sách video!",
    });
    return <p>Không thể tải danh sách video.</p>;
  }

  return (
    <BoxCustom>
      <Typography.Title level={5}>Video đã xuất bản</Typography.Title>
      <Divider style={{ marginTop: 5 }} />
      <List
        style={{ marginTop: 8 }}
        split={false}
        dataSource={data}
        grid={{
          gutter: 8,
          column: 1,
        }}
        renderItem={(item) => (
          <List.Item style={{ padding: 4 }}>
            <Row gutter={16} align={"middle"}>
              <Col span={6}>
                <img
                  alt={item.title}
                  src={item.thumbnail}
                  style={{
                    width: "100%",
                    aspectRatio: "5/3",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              </Col>
              <Col span={18}>
                <p
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    margin: 0,
                    fontSize: 14,
                  }}
                >
                  {item.title}
                </p>
                <Row align={"middle"}>
                  <Col span={6}>
                    <Space>
                      <ChartNoAxesColumn
                        strokeWidth={1.5}
                        size={16}
                        style={{ marginTop: 2 }}
                      />
                      <p style={{ fontSize: 12 }}>{item.view}</p>
                    </Space>
                  </Col>
                  <Col span={4}>
                    <Space>
                      <ThumbsUp
                        strokeWidth={1.5}
                        size={16}
                        style={{ marginTop: 2 }}
                      />
                      <p style={{ fontSize: 12 }}>{item.likes}</p>
                    </Space>
                  </Col>
                  <Col span={4}>
                    <Space>
                      <ThumbsDown
                        strokeWidth={1.5}
                        size={16}
                        style={{ marginTop: 2 }}
                      />
                      <p style={{ fontSize: 12 }}>{item.dislikes}</p>
                    </Space>
                  </Col>
                </Row>
              </Col>
            </Row>
          </List.Item>
        )}
      />
      <Divider style={{ marginTop: 5 }} />
      <Button color="primary" variant="outlined" href="/studio/content">
        Xem số liệu phân tích video
      </Button>
    </BoxCustom>
  );
};

export default VideoPublish;
