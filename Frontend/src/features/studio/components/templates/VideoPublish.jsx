import React from "react";
import BoxCustom from "../../../../components/atoms/BoxCustom";
import { Button, Col, Divider, List, Row, Space, Typography } from "antd";
import { ChartNoAxesColumn, ThumbsDown, ThumbsUp } from "lucide-react";

const VideoPublish = () => {
  const data = Array(3).fill({
    thumbnail: "https://pbs.twimg.com/media/F_vO2geW0AE1mmW.jpg",
    title:
      "Anime Youtube Thumbnails designs, themes, templates and downloadable graphic elements on Dribbble. Your resource to discover and connect with designers worldwide.",
    view: "600 N",
  });
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
                    aspectRatio: "5/ 3",
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
                      <p style={{ fontSize: 12 }}>3</p>
                    </Space>
                  </Col>
                  <Col span={4}>
                    <Space>
                      <ThumbsDown
                        strokeWidth={1.5}
                        size={16}
                        style={{ marginTop: 2 }}
                      />
                      <p style={{ fontSize: 12 }}>3</p>
                    </Space>
                  </Col>
                </Row>
              </Col>
            </Row>
          </List.Item>
        )}
      />
      <Divider style={{ marginTop: 5 }} />
      <Button color="primary" variant="outlined">
        Xem số liệu phân tích video
      </Button>
    </BoxCustom>
  );
};

export default VideoPublish;
