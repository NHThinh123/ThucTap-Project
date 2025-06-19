import React from "react";
import BoxCustom from "../../../../components/atoms/BoxCustom";
import { Avatar, Button, Col, Divider, List, Row, Typography } from "antd";

import { useSubscribers } from "../../hooks/useSubscribers";
import { useContext } from "react";
import { AuthContext } from "../../../../contexts/auth.context";

const SubscriberList = () => {
  // eslint-disable-next-line no-unused-vars
  const { auth, setAuth } = useContext(AuthContext);
  const userId = auth?.user.id; // Lấy userId từ context hoặc props nếu cần
  const { data } = useSubscribers({ userId });
  const subscriberData = data?.subscribers?.slice(0, 5) || [];
  return (
    <BoxCustom>
      <Typography.Title level={5}>Danh sách người đăng ký</Typography.Title>

      <Divider style={{ marginTop: 5 }} />
      <List
        style={{ marginTop: 8 }}
        split={false}
        grid={{
          gutter: 8,
          column: 1,
        }}
        dataSource={subscriberData}
        renderItem={(item) => (
          <List.Item style={{ padding: 4 }}>
            <Row gutter={16} align={"middle"}>
              <Col span={4}>
                <Avatar
                  src={
                    item?.avatar ||
                    "https://res.cloudinary.com/nienluan/image/upload/v1747707203/avaMacDinh_jxwsog.jpg"
                  }
                  size={50}
                />
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
                  {item.nickName}
                </p>
              </Col>
            </Row>
          </List.Item>
        )}
      />
      <Divider style={{ marginTop: 5 }} />
      <Button color="primary" variant="outlined" href="/studio/subscribers">
        Xem tất cả
      </Button>
    </BoxCustom>
  );
};

export default SubscriberList;
