import { Button, Col, Progress, Row, Space, Table, Tag } from "antd";
import {
  ChartNoAxesColumn,
  Pencil,
  ThumbsDown,
  ThumbsUp,
  Trash,
} from "lucide-react";
import React from "react";

import { mockVideos } from "../../../../data/mockVideos";
import { formatDate } from "../../../../constants/formatDate";
import { formatViews } from "../../../../constants/formatViews";

const VideoList = () => {
  const data = mockVideos.map((video, index) => ({
    key: video.id || index,
    video: video,
  }));
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
              src={video.thumbnailUrl}
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
      title: "Ngày đăng tải",
      key: "createdAt",
      dataIndex: "video",
      render: (video) => <p> {formatDate(video.createdAt)}</p>,
    },
    {
      title: "Lượt xem",
      dataIndex: "video",
      key: "views",
      render: (video) => <p> {formatViews(video.views)}</p>,
    },
    {
      title: "Số bình luận",
      dataIndex: "video",
      key: "comment",
      render: (video) => <p> {video.commentCount}</p>,
    },
    {
      title: "Lượt thích(%)",
      dataIndex: "video",
      key: "like",
      render: (video) => {
        const like = parseInt(video.likeCount);
        const dislike = parseInt(video.dislikeCount);
        const total = like + dislike;
        const percent = total === 0 ? 0 : Math.round((like / total) * 100);
        return (
          <>
            <Progress
              percent={percent}
              size={"small"}
              strokeColor={"#c90626"}
            />
            <p style={{ color: "grey", fontSize: 14 }}>{like} lượt thích</p>
          </>
        );
      },
    },

    {
      title: "Hành động",
      key: "action",
      render: () => (
        <Space size="middle">
          <Button type="text">
            <Pencil strokeWidth={1.5} size={18} />
          </Button>
          <Button variant="text" color="primary">
            <Trash strokeWidth={1.5} size={18} />
          </Button>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default VideoList;
