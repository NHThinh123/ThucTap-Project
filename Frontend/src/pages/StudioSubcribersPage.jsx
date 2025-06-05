import React, { useContext } from "react";

import { Avatar, Button, Col, Divider, List, Row, Typography } from "antd";
import { AuthContext } from "../contexts/auth.context";
import { useSubscribers } from "../features/studio/hooks/useSubscribers";
import BoxCustom from "../components/atoms/BoxCustom";

const StudioSubcribersPage = () => {
  const { auth } = useContext(AuthContext);
  const userId = auth?.user.id;
  const { data } = useSubscribers({ userId });
  const subscriberData = data?.subscribers || [];

  return (
    <Row justify={"center"}>
      <Col span={12}>
        <BoxCustom>
          <Typography.Title level={4}>Danh sách người đăng ký</Typography.Title>
          <Divider style={{ margin: "10px 0" }} />
          <List
            style={{ marginTop: 8 }}
            split={false}
            grid={{
              gutter: 12,
              column: 1,
            }}
            dataSource={subscriberData}
            renderItem={(item) => (
              <List.Item style={{ padding: 6 }}>
                <Row gutter={16} align="middle">
                  <Col span={4}>
                    <Avatar src={item.avatar} size={60} />
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
                        fontWeight: "600",
                        fontSize: "16px",
                      }}
                    >
                      {item.nickName}
                    </p>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </BoxCustom>
      </Col>
    </Row>
  );
};

export default StudioSubcribersPage;
