/* eslint-disable no-unused-vars */
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
  Spin,
  message,
  Input as SearchInput,
} from "antd";
import {
  ChartNoAxesColumn,
  Pencil,
  ThumbsDown,
  ThumbsUp,
  Trash,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { useVideoManagement } from "../../hooks/useVideoManagement";
import { useUserVideos } from "../../hooks/useUserVideos";
import { useVideoUpload } from "../../../uploadvideo/hooks/useVideoUpload";
import { formatDate } from "../../../../constants/formatDate";
import { formatViews } from "../../../../constants/formatViews";
import { UploadOutlined } from "@ant-design/icons";

const VideoList = ({ userId }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const { editVideo, isEditing, deleteVideo, isDeleting } =
    useVideoManagement(userId);
  const { data: videos, isLoading, error } = useUserVideos(userId);
  const { uploadThumbnail, isUploadingThumbnail } = useVideoUpload();

  const showEditModal = (video) => {
    setSelectedVideo(video);
    setThumbnailPreview(video.thumbnail_video || null);
    setThumbnailUrl(video.thumbnail_video || null);
    form.setFieldsValue({
      title: video.title,
      description: video.description_video,
      thumbnail: video.thumbnail_video
        ? [{ url: video.thumbnail_video, status: "done", name: "thumbnail" }]
        : [],
    });
    setIsEditModalVisible(true);
  };

  const showDeleteModal = (video) => {
    setSelectedVideo(video);
    setIsDeleteModalVisible(true);
  };

  const handleThumbnailChange = ({ fileList }) => {
    if (fileList.length > 0 && fileList[0].originFileObj) {
      const file = fileList[0].originFileObj;
      const newThumbnailUrl = URL.createObjectURL(file);
      setThumbnailPreview(newThumbnailUrl);

      uploadThumbnail(file, {
        onSuccess: (data) => {
          setThumbnailUrl(data);
        },
        onProgress: (percent) => {
          console.log(`Upload progress: ${percent}%`);
        },
      });
    } else {
      setThumbnailPreview(selectedVideo?.thumbnail_video || null);
      setThumbnailUrl(selectedVideo?.thumbnail_video || null);
    }
    form.setFieldsValue({ thumbnail: fileList });
  };

  const handleEditOk = () => {
    form
      .validateFields()
      .then((values) => {
        editVideo(selectedVideo._id, {
          title: values.title,
          description: values.description,
          thumbnail: thumbnailUrl,
        });
        setIsEditModalVisible(false);
        form.resetFields();
        setThumbnailPreview(null);
        setThumbnailUrl(null);
      })
      .catch(() => {
        messageApi.error("Vui lòng kiểm tra lại thông tin!");
      });
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    form.resetFields();
    setThumbnailPreview(null);
    setThumbnailUrl(null);
  };

  const handleDeleteOk = () => {
    deleteVideo(selectedVideo._id);
    setIsDeleteModalVisible(false);
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

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredData = useMemo(() => {
    return (
      videos
        ?.map((video, index) => ({
          key: video._id || index,
          video: {
            ...video,
            id: video._id,
            thumbnailUrl: video.thumbnail_video,
            description: video.description_video,
            createdAt: video.createdAt,
            views: video.views,
            commentCount: video.comments,
            likeCount: video.likes,
            dislikeCount: video.dislikes,
          },
        }))
        .filter((item) =>
          item.video.title.toLowerCase().includes(searchText.toLowerCase())
        ) || []
    );
  }, [videos, searchText]);

  const columns = [
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          Video
          <SearchInput
            placeholder="Tìm kiếm theo tiêu đề"
            allowClear
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: "100%", maxWidth: "200px" }}
          />
        </div>
      ),
      dataIndex: "video",
      key: "video",
      width: "35%",
      minWidth: 200,
      sorter: (a, b) => a.video.title.localeCompare(b.video.title),
      render: (video) => (
        <Row gutter={[12, 8]} align="middle">
          <Col xs={8} sm={6} md={6} lg={6}>
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
          <Col xs={16} sm={18} md={18} lg={18}>
            <p
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                margin: 0,
                fontWeight: "700",
                fontSize: "clamp(14px, 3.5vw, 16px)",
              }}
            >
              {video.title}
            </p>
            <Row align="middle">
              <p
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  margin: 0,
                  fontSize: "clamp(12px, 3vw, 14px)",
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
      sorter: (a, b) =>
        new Date(a.video.createdAt) - new Date(b.video.createdAt),
      render: (video) => (
        <p style={{ fontSize: "clamp(12px, 3vw, 14px)" }}>
          {formatDate(video.createdAt)}
        </p>
      ),
      responsive: ["sm"], // Ẩn trên màn hình nhỏ hơn sm
    },
    {
      title: "Lượt xem",
      dataIndex: "video",
      key: "views",
      sorter: (a, b) => a.video.views - b.video.views,
      render: (video) => (
        <p style={{ fontSize: "clamp(12px, 3vw, 14px)" }}>
          {formatViews(video.views)}
        </p>
      ),
    },
    {
      title: "Số bình luận",
      dataIndex: "video",
      key: "comment",
      sorter: (a, b) => a.video.commentCount - b.video.commentCount,
      render: (video) => (
        <p style={{ fontSize: "clamp(12px, 3vw, 14px)" }}>
          {video.commentCount}
        </p>
      ),
      responsive: ["md"], // Ẩn trên màn hình nhỏ hơn md
    },
    {
      title: "Lượt thích(%)",
      dataIndex: "video",
      key: "like",
      sorter: (a, b) => {
        const aLike = parseInt(a.video.likeCount);
        const aDislike = parseInt(a.video.dislikeCount);
        const aTotal = aLike + aDislike;
        const aPercent = aTotal === 0 ? 0 : Math.round((aLike / aTotal) * 100);

        const bLike = parseInt(b.video.likeCount);
        const bDislike = parseInt(b.video.dislikeCount);
        const bTotal = bLike + bDislike;
        const bPercent = bTotal === 0 ? 0 : Math.round((bLike / bTotal) * 100);

        return aPercent - bPercent;
      },
      render: (video) => {
        const like = parseInt(video.likeCount);
        const dislike = parseInt(video.dislikeCount);
        const total = like + dislike;
        const percent = total === 0 ? 0 : Math.round((like / total) * 100);
        return (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Progress
                percent={percent}
                size="small"
                strokeColor="#c90626"
                showInfo={false}
                style={{ maxWidth: "120px" }}
              />
              <span
                style={{ color: "black", fontSize: "clamp(12px, 3vw, 14px)" }}
              >
                {percent === 100 ? "100%" : `${percent}%`}
              </span>
            </div>
            <p
              style={{
                color: "grey",
                fontSize: "clamp(12px, 3vw, 14px)",
                textAlign: "end",
              }}
            >
              {like} lượt thích
            </p>
          </>
        );
      },
      responsive: ["md"], // Ẩn trên màn hình nhỏ hơn md
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
            <Trash strokeWidth={1.5} size={18} color="#c90626" />
          </Button>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
    );
  }

  if (error) {
    messageApi.error(error.message || "Lỗi khi tải danh sách video!");
    return <p>Không thể tải danh sách video.</p>;
  }

  return (
    <>
      {contextHolder}
      <Table
        columns={columns}
        dataSource={filteredData}
        showSorterTooltip={false}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          position: ["bottomRight"],
        }}
        scroll={{ x: 800 }} // Cho phép cuộn ngang trên màn hình nhỏ
      />
      <Modal
        title="Chỉnh sửa video"
        open={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Lưu"
        cancelText="Hủy"
        centered
        confirmLoading={isEditing || isUploadingThumbnail}
        width="90%"
        style={{ maxWidth: "600px" }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="thumbnail"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <div style={{ marginBottom: 16 }}>
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  style={{
                    width: "100%",
                    maxWidth: "400px",
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
              beforeUpload={() => false}
              onChange={handleThumbnailChange}
              disabled={isUploadingThumbnail}
            >
              <Button icon={<UploadOutlined />} loading={isUploadingThumbnail}>
                Chọn ảnh
              </Button>
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
            <Input.TextArea rows={6} placeholder="Nhập mô tả video" />
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
        confirmLoading={isDeleting}
        width="90%"
        style={{ maxWidth: "400px" }}
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
