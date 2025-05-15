import React from "react";
import BoxCustom from "../../../../components/atoms/BoxCustom";
import { Button, Col, Divider, Row, Space, Typography } from "antd";
import { ChartNoAxesColumn, ThumbsDown, ThumbsUp } from "lucide-react";

const NewestVideoAnalysis = () => {
  return (
    <BoxCustom>
      <Typography.Title level={5}>
        Hiệu suất video mới nhất của bạn
      </Typography.Title>
      <img
        alt={"video mới nhất"}
        src={"https://pbs.twimg.com/media/F_vO2geW0AE1mmW.jpg"}
        style={{
          width: "100%",
          aspectRatio: "5/ 3",
          borderRadius: "8px",
          objectFit: "cover",
        }}
      />
      <h4
        style={{
          marginTop: "8px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        Anime Youtube Thumbnails designs, themes, templates and downloadable
        graphic elements on Dribbble. Your resource to discover and connect with
        designers worldwide.
      </h4>
      <Row style={{ marginTop: 8 }} align={"middle"}>
        <Col span={6}>
          <Space>
            <ChartNoAxesColumn
              strokeWidth={1.5}
              size={20}
              style={{ marginTop: 2 }}
            />
            <p>600 N</p>
          </Space>
        </Col>
        <Col span={4}>
          <Space>
            <ThumbsUp strokeWidth={1.5} size={20} style={{ marginTop: 2 }} />
            <p>3</p>
          </Space>
        </Col>
        <Col span={4}>
          <Space>
            <ThumbsDown strokeWidth={1.5} size={20} style={{ marginTop: 2 }} />
            <p>3</p>
          </Space>
        </Col>
      </Row>
      <Divider style={{ marginTop: "10px" }} />
      <Button style={{ marginBottom: 8 }}>Xem số liệu phân tích video</Button>
      <Button>Xem bình luận (2)</Button>
    </BoxCustom>
  );
};

export default NewestVideoAnalysis;
