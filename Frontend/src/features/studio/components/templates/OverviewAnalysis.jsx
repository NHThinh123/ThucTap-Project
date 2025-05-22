import React from "react";
import BoxCustom from "../../../../components/atoms/BoxCustom";
import { Button, Col, Divider, Flex, List, Row, Typography } from "antd";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";

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
      <Typography.Title level={2} style={{ marginBottom: 8 }}>
        50 N
      </Typography.Title>
      <Typography.Text type="secondary" style={{ fontSize: 14 }}>
        <Typography.Text
          type="secondary"
          style={{ color: "#bb2124", fontSize: 14 }}
        >
          Giảm 2{" "}
        </Typography.Text>
        trong 28 ngày qua
      </Typography.Text>
      <Divider style={{ marginTop: 5 }} />
      <Typography.Title level={5} style={{ margin: 0 }}>
        Tóm tắt
      </Typography.Title>
      <Typography.Text type="secondary">28 ngày qua</Typography.Text>
      <Col span={24} style={{ padding: "0px ", marginTop: 8 }}>
        <Flex justify="space-between" align="center">
          <Typography.Text>Lượt xem:</Typography.Text>
          <Typography.Text>
            <CircleArrowUp
              size={16}
              color="#22bb33"
              style={{ marginBottom: -2 }}
            />{" "}
            2
          </Typography.Text>
        </Flex>
        <Flex justify="space-between" align="center">
          <Typography.Text>Lượt thích:</Typography.Text>
          <Typography.Text>
            <CircleArrowUp
              size={16}
              color="#22bb33"
              style={{ marginBottom: -2 }}
            />{" "}
            2
          </Typography.Text>
        </Flex>
        <Flex justify="space-between" align="center">
          <Typography.Text>Lượt không thích:</Typography.Text>
          <Typography.Text>
            <CircleArrowDown
              size={16}
              color="#bb2124"
              style={{ marginBottom: -2 }}
            />{" "}
            2
          </Typography.Text>
        </Flex>
      </Col>

      <Divider style={{ marginTop: 5 }} />
      <Typography.Title level={5}>Video hàng đầu của bạn</Typography.Title>
      <Typography.Text type="secondary">
        28 ngày qua • Số lượt xem
      </Typography.Text>
      <List
        style={{ marginTop: 8 }}
        split={false}
        dataSource={data}
        grid={{
          gutter: 4,
          column: 1,
        }}
        renderItem={(item) => (
          <List.Item style={{ padding: 0 }}>
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
