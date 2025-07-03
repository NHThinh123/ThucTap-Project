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
import React, { useState, useMemo, useEffect } from "react";
import { useVideoManagement } from "../../hooks/useVideoManagement";
import { useAllVideos } from "../../hooks/useAllVideos";
import { useVideoUpload } from "../../../uploadvideo/hooks/useVideoUpload";
import { formatDate } from "../../../../constants/formatDate";
import { formatViews } from "../../../../constants/formatViews";
import { UploadOutlined } from "@ant-design/icons";

const AllVideoList = ({ userId }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [form] = Form.useForm();
  const { editVideo, isEditing, deleteVideo, isDeleting } =
    useVideoManagement(userId);
  const { data: videos, isLoading, error } = useAllVideos(userId);
  const { uploadThumbnail, isUploadingThumbnail } = useVideoUpload();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth < 1024;

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
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "8px" }}>
          <span>Video</span>
          <SearchInput
            placeholder="Tìm kiếm theo tiêu đề"
            allowClear
            onChange={(e) => handleSearch(e.target.value)}
            style={{ 
              width: isMobile ? "100%" : 200,
              minWidth: isMobile ? "auto" : 150
            }}
            size={isMobile ? "small" : "middle"}
          />
        </div>
      ),
      dataIndex: "video",
      key: "video",
      width: isMobile ? "100%" : "40%",
      sorter: (a, b) => a.video.title.localeCompare(b.video.title),
      render: (video) => (
        <Row 
          gutter={[8, 8]} 
          align="middle"
          wrap={isMobile}
        >
          <Col xs={24} sm={6} md={6} lg={6}>
            <img
              alt={video.title}
              src={video.thumbnailUrl}
              style={{
                width: "100%",
                maxWidth: isMobile ? "120px" : "100%",
                aspectRatio: "16/9",
                borderRadius: "8px",
                objectFit: "cover",
                margin: isMobile ? "0 auto" : "0",
                display: "block"
              }}
            />
          </Col>
          <Col xs={24} sm={18} md={18} lg={18}>
            <div style={{ padding: isMobile ? "8px 0" : "0" }}>
              <p
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: isMobile ? 2 : 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  margin: 0,
                  fontWeight: "700",
                  fontSize: isMobile ? "14px" : "16px",
                  lineHeight: isMobile ? "1.4" : "1.2"
                }}
              >
                {video.title}
              </p>
              <div style={{ marginTop: "4px" }}>
                <p
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: isMobile ? 1 : 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    margin: 0,
                    fontSize: isMobile ? "12px" : 14,
                    color: "gray",
                    lineHeight: "1.3"
                  }}
                >
                  {video.description}
                </p>
              </div>
              {isMobile && (
                <div style={{ 
                  marginTop: "8px", 
                  display: "flex", 
                  gap: "12px",
                  flexWrap: "wrap",
                  fontSize: "11px",
                  color: "#666"
                }}>
                  <span>{formatDate(video.createdAt)}</span>
                  <span>{formatViews(video.views)} lượt xem</span>
                </div>
              )}
            </div>
          </Col>
        </Row>
      ),
    },
    {
      title: "Ngày đăng tải",
      key: "createdAt",
      dataIndex: "video",
      width: isMobile ? 0 : "20%",
      responsive: ["md"],
      sorter: (a, b) =>
        new Date(a.video.createdAt) - new Date(b.video.createdAt),
      render: (video) => (
        <p style={{ 
          margin: 0,
          fontSize: isTablet ? "13px" : "14px"
        }}>
          {formatDate(video.createdAt)}
        </p>
      ),
    },
    {
      title: "Lượt xem",
      dataIndex: "video",
      key: "views",
      width: isMobile ? 0 : "15%",
      responsive: ["lg"],
      sorter: (a, b) => a.video.views - b.video.views,
      render: (video) => (
        <p style={{ 
          margin: 0,
          fontSize: isTablet ? "13px" : "14px",
          fontWeight: "500"
        }}>
          {formatViews(video.views)}
        </p>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: isMobile ? "20%" : "15%",
      fixed: isMobile ? false : "right",
      render: (_, record) => (
        <Space size={isMobile ? "small" : "middle"} direction={isMobile ? "vertical" : "horizontal"}>
          <Button 
            type="text" 
            onClick={() => showEditModal(record.video)}
            size={isMobile ? "small" : "middle"}
            style={{ padding: isMobile ? "4px" : "4px 8px" }}
          >
            <Pencil strokeWidth={1.5} size={isMobile ? 16 : 18} />
          </Button>
          <Button 
            type="text" 
            onClick={() => showDeleteModal(record.video)}
            size={isMobile ? "small" : "middle"}
            style={{ padding: isMobile ? "4px" : "4px 8px" }}
          >
            <Trash strokeWidth={1.5} size={isMobile ? 16 : 18} color="#c90626" />
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
      <div style={{ width: "100%", overflowX: "auto" }}>
        <Table
          columns={columns}
          dataSource={filteredData}
          showSorterTooltip={false}
          scroll={{ 
            x: isMobile ? 600 : 1000,
            y: window.innerHeight > 800 ? 400 : 300 
          }}
          pagination={{
            pageSize: isMobile ? 3 : 5,
            showSizeChanger: !isMobile,
            showQuickJumper: !isMobile,
            position: ["bottomCenter"],
            showTotal: (total, range) => 
              isMobile 
                ? `${range[0]}-${range[1]} / ${total}`
                : `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} video`,
            responsive: true,
            size: isMobile ? "small" : "default",
            pageSizeOptions: isMobile ? ["3", "5"] : ["5", "10", "20"],
          }}
          size={isMobile ? "small" : "middle"}
          className="responsive-video-table"
          rowClassName={() => isMobile ? "mobile-row" : ""}
        />
      </div>
      <Modal
        title="Chỉnh sửa video"
        open={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Lưu"
        cancelText="Hủy"
        centered
        confirmLoading={isEditing || isUploadingThumbnail}
        width={isMobile ? "90%" : 600}
        style={{ 
          maxWidth: isMobile ? "95vw" : "600px",
          margin: isMobile ? "16px" : "auto"
        }}
        bodyStyle={{
          padding: isMobile ? "16px" : "24px",
          maxHeight: isMobile ? "70vh" : "80vh",
          overflowY: "auto"
        }}
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
                    width: isMobile ? "100%" : "70%",
                    maxWidth: "300px",
                    aspectRatio: "16/9",
                    borderRadius: "8px",
                    objectFit: "cover",
                    display: "block",
                    margin: "0 auto"
                  }}
                />
              ) : (
                <p style={{ textAlign: "center", color: "#666" }}>Chưa có thumbnail</p>
              )}
            </div>
            <Upload
              listType="text"
              maxCount={1}
              beforeUpload={() => false}
              onChange={handleThumbnailChange}
              disabled={isUploadingThumbnail}
            >
              <Button 
                icon={<UploadOutlined />} 
                loading={isUploadingThumbnail}
                block={isMobile}
                style={{ 
                  marginBottom: "16px",
                  width: isMobile ? "100%" : "auto"
                }}
              >
                Chọn ảnh
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input 
              placeholder="Nhập tiêu đề video" 
              size={isMobile ? "large" : "middle"}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea 
              rows={isMobile ? 4 : 6} 
              placeholder="Nhập mô tả video"
              style={{ resize: "vertical" }}
            />
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
        width={isMobile ? "90%" : 400}
        style={{ 
          maxWidth: isMobile ? "95vw" : "400px",
          margin: isMobile ? "16px" : "auto"
        }}
        bodyStyle={{
          padding: isMobile ? "16px" : "24px"
        }}
      >
        <p style={{ 
          fontSize: isMobile ? "14px" : "16px",
          lineHeight: "1.5",
          textAlign: "center"
        }}>
          Bạn có chắc chắn muốn xóa video "
          <strong style={{ color: "#c90626" }}>{selectedVideo?.title}</strong>" không?
        </p>
        <p style={{ 
          fontSize: "12px", 
          color: "#666", 
          textAlign: "center",
          marginTop: "8px",
          marginBottom: 0
        }}>
          Hành động này không thể hoàn tác.
        </p>
      </Modal>
    </>
  );
};

export default AllVideoList;
