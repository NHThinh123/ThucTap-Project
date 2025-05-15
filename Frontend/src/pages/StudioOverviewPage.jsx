import { Button, Col, Divider, List, Row, Space, Typography } from "antd";
import React from "react";
import BoxCustom from "../components/atoms/BoxCustom";
import { ChartNoAxesColumn, ThumbsDown, ThumbsUp } from "lucide-react";

import NewestVideoAnalysis from "../features/studio/components/templates/NewestVideoAnalysis";
const data = Array(3).fill({
  description:
    "Anime Youtube Thumbnails designs, themes, templates and downloadable graphic elements on Dribbble. Your resource to discover and connect with designers worldwide.",
  value: "600 N",
});
const StudioOverviewPage = () => {
  return (
    <>
      <Typography.Title level={3}>Tổng quan của kênh</Typography.Title>
      <Row gutter={16}>
        <Col span={8}>
          <BoxCustom>
            <Typography.Title level={5}>
              Số liệu phân tích về kênh
            </Typography.Title>
            <p> Số người đăng ký hiện tại</p>
            <Typography.Title level={2}>50 N</Typography.Title>
            <Divider style={{ marginTop: 5 }} />
            <Typography.Title level={5}>
              Video hàng đầu của bạn
            </Typography.Title>
            <Typography.Text type="secondary">
              48h qua • Số lượt xem
            </Typography.Text>
            <List
              style={{ marginTop: 8 }}
              split={false}
              dataSource={data}
              renderItem={(item) => (
                <List.Item style={{ padding: 4 }}>
                  <Row style={{ width: "100%" }}>
                    <Col span={20}>
                      <p
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          margin: 0,
                        }}
                      >
                        {item.description}
                      </p>
                    </Col>
                    <Col span={4}>
                      <Typography.Text type="secondary">
                        {item.value}
                      </Typography.Text>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
            <Divider style={{ marginTop: 5 }} />
            <Button>Xem số liệu phân tích video</Button>
          </BoxCustom>
        </Col>
        <Col span={8}>
          <NewestVideoAnalysis />
        </Col>
        <Col span={8}>
          <BoxCustom>
            <Typography.Title level={5}>
              Hiệu suất video mới nhất của bạn
            </Typography.Title>
          </BoxCustom>
        </Col>
      </Row>
    </>
  );
};

export default StudioOverviewPage;
