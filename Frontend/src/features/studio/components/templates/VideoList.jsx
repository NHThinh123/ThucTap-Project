import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Progress,
  Row,
  Space,
  Table,
  Upload,
  message,
} from "antd";
import {
  ChartNoAxesColumn,
  Pencil,
  ThumbsDown,
  ThumbsUp,
  Trash,
} from "lucide-react";
import React, { useState } from "react";

import { mockVideos } from "../../../../data/mockVideos";
import { formatDate } from "../../../../constants/formatDate";
import { formatViews } from "../../../../constants/formatViews";
import { UploadOutlined } from "@ant-design/icons";

const VideoList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [form] = Form.useForm();

  const showEditModal = (video) => {
    setSelectedVideo(video);
    setThumbnailPreview(video.thumbnailUrl || null);
    form.setFieldsValue({
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnailUrl
        ? [{ url: video.thumbnailUrl, status: "done" }]
        : [],
    });
    setIsEditModalVisible(true);
  };

  const showDeleteModal = (video) => {
    setSelectedVideo(video);
    setIsDeleteModalVisible(true);
  };

  const handleUploadThumbnail = async (file) => {
    // Placeholder cho API upload thumbnail
    try {
      // const response = await api.uploadThumbnail(file, selectedVideo.id);
      // Giả lập URL trả về từ API
      const newThumbnailUrl = URL.createObjectURL(file); // Tạm dùng để preview
      setThumbnailPreview(newThumbnailUrl);
      messageApi.success("Tải thumbnail lên thành công!");
      return true;
    } catch (error) {
      messageApi.error("Tải thumbnail thất bại!");
      return false;
    }
  };

  const handleEditOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          // API call cho tiêu đề và mô tả
          // const response = await api.updateVideoDetails(selectedVideo.id, {
          //   title: values.title,
          //   description: values.description,
          // });
          messageApi.success("Cập nhật video thành công!");
          setIsEditModalVisible(false);
          form.resetFields();
          setThumbnailPreview(null);
        } catch (error) {
          messageApi.error("Cập nhật video thất bại!");
        }
      })
      .catch(() => {
        messageApi.error("Vui lòng kiểm tra lại thông tin!");
      });
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    form.resetFields();
    setThumbnailPreview(null);
  };

  const handleDeleteOk = () => {
    // Placeholder cho API xóa
    try {
      // const response = await api.deleteVideo(selectedVideo.id);
      messageApi.success("Xóa video thành công!");
      setIsDeleteModalVisible(false);
    } catch (error) {
      messageApi.error("Xóa video thất bại!");
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

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
                aspectRatio: "5/3",
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
      render: (video) => <p>{formatDate(video.createdAt)}</p>,
    },
    {
      title: "Lượt xem",
      dataIndex: "video",
      key: "views",
      render: (video) => <p>{formatViews(video.views)}</p>,
    },
    {
      title: "Số bình luận",
      dataIndex: "video",
      key: "comment",
      render: (video) => <p>{video.commentCount}</p>,
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
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" onClick={() => showEditModal(record.video)}>
            <Pencil strokeWidth={1.5} size={18} />
          </Button>
          <Button type="text" onClick={() => showDeleteModal(record.video)}>
            <Trash strokeWidth={1.5} size={18} />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Table columns={columns} dataSource={data} />
      <Modal
        title="Chỉnh sửa video"
        open={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Lưu"
        cancelText="Hủy"
        centered
      >
        <Form form={form} layout="vertical">
          <Form.Item name="thumbnail">
            <div style={{ marginBottom: 16 }}>
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  style={{
                    width: "70%",
                    aspectRatio: "16/9",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <p>Chưa có thumbnail</p>
              )}
            </div>
            <Upload
              listType="text"
              maxCount={1}
              beforeUpload={(file) => {
                handleUploadThumbnail(file);
                return false; // Ngăn tự động upload
              }}
              onChange={({ fileList }) => {
                form.setFieldsValue({ thumbnail: fileList });
              }}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input placeholder="Nhập tiêu đề video" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả video" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>
          Bạn có chắc chắn muốn xóa video "
          <strong>{selectedVideo?.title}</strong>" không?
        </p>
      </Modal>
    </>
  );
};

export default VideoList;
