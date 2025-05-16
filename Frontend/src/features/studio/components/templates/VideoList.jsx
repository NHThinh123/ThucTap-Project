import { Col, Progress, Row, Space, Table, Tag } from "antd";
import { ChartNoAxesColumn, ThumbsDown, ThumbsUp } from "lucide-react";
import React from "react";

const VideoList = () => {
  const columns = [
    {
      title: "Video",
      dataIndex: "video",
      key: "video",
      width: "35%",
      minWidth: 200,
      render: (video) => (
        <Row gutter={16} align={"middle"}>
          <Col span={6}>
            <img
              alt={video.title}
              src={video.thumbnail}
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
                fontWeight: "700",
              }}
            >
              {video.title}
            </p>
            <Row align={"middle"}>
              <p
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  margin: 0,
                  fontSize: 14,
                  color: "gray",
                }}
              >
                {video.description}
              </p>
            </Row>
          </Col>
        </Row>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Ngày đăng tải",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Lượt xem",
      dataIndex: "view",
      key: "view",
    },
    {
      title: "Số bình luận",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Lượt thích(%)",
      dataIndex: "like",
      key: "like",
      render: (like) => (
        <>
          <Progress percent={like} size={"small"} />
          <p style={{ color: "grey", fontSize: 14 }}>{like} lượt thích</p>
        </>
      ),
    },

    {
      title: "Action",
      key: "action",
      render: () => (
        <Space size="middle">
          <a>Sửa</a>
          <a>Xóa</a>
        </Space>
      ),
    },
  ];
  const data = [
    {
      key: "1",
      video: {
        thumbnail:
          "https://cdn.dribbble.com/userupload/12205471/file/original-6e438536dab71e35649e6c5ab9111f7e.png?format=webp&resize=400x300&vertical=center",
        title:
          "Anime Youtube Thumbnails designs, themes, templates and downloadable graphic elements on Dribbble",
        description:
          "Anime Youtube Thumbnails designs, themes, templates and downloadable graphic elements on Dribbble. Your resource to discover and connect with designers worldwide.",
      },
      status: "Public",
      createdAt: "2023-10-01",
      view: "600 N",
      like: "95",
      comment: "3",
    },
    {
      key: "2",
      video: {
        thumbnail:
          "https://cdn.dribbble.com/userupload/12205471/file/original-6e438536dab71e35649e6c5ab9111f7e.png?format=webp&resize=400x300&vertical=center",
        title:
          "Anime Youtube Thumbnails designs, themes, templates and downloadable graphic elements on Dribbble",

        description:
          "Anime Youtube Thumbnails designs, themes, templates and downloadable graphic elements on Dribbble. Your resource to discover and connect with designers worldwide.",
      },
      status: "Private",
      createdAt: "2023-10-01",
      view: "600 N",
      like: "80",
      comment: "3",
    },
    {
      key: "3",
      video: {
        thumbnail:
          "https://cdn.dribbble.com/userupload/12205471/file/original-6e438536dab71e35649e6c5ab9111f7e.png?format=webp&resize=400x300&vertical=center",
        title:
          "Anime Youtube Thumbnails designs, themes, templates and downloadable graphic elements on Dribbble",

        description:
          "Anime Youtube Thumbnails designs, themes, templates and downloadable graphic elements on Dribbble. Your resource to discover and connect with designers worldwide.",
      },
      status: "Public",
      createdAt: "2023-10-01",
      view: "600 N",
      like: "47",
      comment: "3",
    },
  ];
  return <Table columns={columns} dataSource={data} />;
};

export default VideoList;
