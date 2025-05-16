import React from "react";
import BoxCustom from "../../../../components/atoms/BoxCustom";
import { Avatar, Button, Col, Divider, List, Row, Typography } from "antd";

const SubcriberList = () => {
  const data = Array(3).fill({
    thumbnail: "https://pbs.twimg.com/media/F_vO2geW0AE1mmW.jpg",
    name: "KAFF Gaming",
    subcriber: "61",
  });
  return (
    <BoxCustom>
      <Typography.Title level={5}>Danh sách người đăng ký</Typography.Title>
      <Typography.Text type="secondary"> 90 ngày qua</Typography.Text>
      <Divider style={{ marginTop: 5 }} />
      <List
        style={{ marginTop: 8 }}
        split={false}
        grid={{
          gutter: 8,
          column: 1,
        }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item style={{ padding: 4 }}>
            <Row gutter={16} align={"middle"}>
              <Col span={4}>
                <Avatar src={item.thumbnail} size={50} />
              </Col>
              <Col span={20}>
                <p
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    margin: 0,
                    fontWeight: "700",
                  }}
                >
                  {item.name}
                </p>
                <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                  {item.subcriber} người đăng ký
                </Typography.Text>
              </Col>
            </Row>
          </List.Item>
        )}
      />
      <Divider style={{ marginTop: 5 }} />
      <Button color="primary" variant="outlined">
        Xem tất cả
      </Button>
    </BoxCustom>
  );
};

export default SubcriberList;
