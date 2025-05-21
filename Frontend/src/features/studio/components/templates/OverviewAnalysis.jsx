import React from "react";
import BoxCustom from "../../../../components/atoms/BoxCustom";
import { Button, Col, Divider, List, Row, Typography } from "antd";

const OverviewAnalysis = () => {
  const data = Array(3).fill({
    title:
      "Anime Youtube Thumbnails designs, themes, templates and downloadable graphic elements on Dribbble. Your resource to discover and connect with designers worldwide.",
    view: "600 N",
  });
  return (
    <BoxCustom>
      <Typography.Title level={5}>Số liệu phân tích về kênh</Typography.Title>
      <Divider style={{ marginTop: 5 }} />
      <p> Số người đăng ký hiện tại</p>
      <Typography.Title level={2}>50 N</Typography.Title>
      <Typography.Text type="secondary" style={{ fontSize: 14 }}>
        Giảm 2 so với hôm qua
      </Typography.Text>
      <Divider style={{ marginTop: 5 }} />
      <Typography.Title level={5}>Tóm tắt</Typography.Title>
      <Col span={24}>
        <Typography.Text type="secondary">
          Lượt xem: tăng 2 so với hôm qua
        </Typography.Text>
      </Col>
      <Col span={24}>
        <Typography.Text type="secondary">
          Lượt thích: tăng 2 so với hôm qua
        </Typography.Text>
      </Col>
      <Col span={24}>
        <Typography.Text type="secondary">
          Lượt không thích: tăng 2 so với hôm qua
        </Typography.Text>
      </Col>
      <Divider style={{ marginTop: 5 }} />
      <Typography.Title level={5}>Video hàng đầu của bạn</Typography.Title>
      <Typography.Text type="secondary">48h qua • Số lượt xem</Typography.Text>
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
                  {item.title}
                </p>
              </Col>
              <Col span={4}>
                <Typography.Text type="secondary">{item.view}</Typography.Text>
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

export default OverviewAnalysis;
