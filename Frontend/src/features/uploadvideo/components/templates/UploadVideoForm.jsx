/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import { Form, Input, Button, Upload, Steps, App, Space, Progress } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useVideoUpload } from "../../hooks/useVideoUpload";
import { useModal } from "../../../../contexts/modal.context";
import { AuthContext } from "../../../../contexts/auth.context";

const { Step } = Steps;

const VideoUploadForm = ({ onSuccess }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [videoFileList, setVideoFileList] = useState([]);
  const [thumbnailFileList, setThumbnailFileList] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [previewThumbnail, setPreviewThumbnail] = useState(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);
  const {
    uploadVideo,
    isUploading,
    videoUrl,
    createVideo,
    isCreating,
    reset,
    uploadThumbnail,
    isUploadingThumbnail,
    thumbnail,
    duration,
  } = useVideoUpload();

  const { openModal, closeModal } = useModal();
  const { auth } = useContext(AuthContext);

  // Cập nhật duration trong form
  useEffect(() => {
    return () => {
      if (previewVideo) {
        URL.revokeObjectURL(previewVideo);
      }
      if (previewThumbnail) {
        URL.revokeObjectURL(previewThumbnail);
      }
    };
  }, [previewVideo, previewThumbnail]);

  const handleUploadVideo = () => {
    if (videoFileList.length === 0) {
      message.error("Vui lòng chọn video!");
      return;
    }

    setVideoProgress(0);
    console.log("Starting video upload:", videoFileList[0].name);
    uploadVideo(videoFileList[0], {
      onSuccess: () => {
        console.log("Video upload completed");
        setPreviewVideo(null);
        setVideoProgress(100);
        setCurrentStep(1);
      },
      onError: (error) => {
        console.error("Video upload failed:", error);
        message.error("Đã xảy ra lỗi khi tải video!");
        setVideoProgress(0);
      },
      onProgress: (percent) => {
        console.log("Video upload progress:", percent);
        setVideoProgress(Math.round(percent));
      },
    });
  };

  const handleUploadThumbnail = () => {
    if (thumbnailFileList.length === 0) {
      message.error("Vui lòng chọn ảnh thumbnail!");
      return;
    }

    setThumbnailProgress(0);
    console.log("Starting thumbnail upload:", thumbnailFileList[0].name);
    uploadThumbnail(thumbnailFileList[0], {
      onSuccess: () => {
        console.log("Thumbnail upload completed");
        setPreviewThumbnail(null);
        setThumbnailProgress(100);
        setCurrentStep(2);
      },
      onError: (error) => {
        console.error("Thumbnail upload failed:", error);
        message.error("Đã xảy ra lỗi khi tải ảnh thumbnail!");
        setThumbnailProgress(0);
      },
      onProgress: (percent) => {
        console.log("Thumbnail upload progress:", percent);
        setThumbnailProgress(Math.round(percent));
      },
    });
  };


  const handleSkipThumbnail = () => {
    if (videoThumbnail) {
      setCurrentStep(2);
    } else {
      message.error("Không có thumbnail video để sử dụng!");
    }
  };

  const handleCreate = async (values) => {
    if (!auth.isAuthenticated) {
      message.error("Vui lòng đăng nhập để tạo video!");
      return;
    }
    if (!auth.user?.id) {
      message.error("Không tìm thấy ID người dùng. Vui lòng đăng nhập lại!");
      return;
    }
    if (!videoUrl) {
      message.error("Vui lòng tải video lên trước!");
      return;
    }

    try {
      const videoDuration = duration || 0;

      console.log("Creating video with data:", {
        user_id: auth.user.id,
        title: values.title,
        description: values.description,
        video_url: videoUrl,
        thumbnail: thumbnail || "",
        duration: videoDuration,
      });

      await createVideo({
        user_id: auth.user.id,
        title: values.title,
        description: values.description,
        video_url: videoUrl,
        thumbnail: thumbnail || "",
        duration: videoDuration,
      });
      form.resetFields();
      setVideoFileList([]);
      setThumbnailFileList([]);
      setPreviewVideo(null);
      setPreviewThumbnail(null);
      setVideoProgress(0);
      setThumbnailProgress(0);
      reset();
      setCurrentStep(0);
      closeModal();
      onSuccess && onSuccess();
    } catch (error) {
      console.error("Create video catch error:", error);
      message.error("Đã xảy ra lỗi khi tạo video: " + (error.message || ""));
    }
  };

  const videoUploadProps = {
    beforeUpload: (file) => {
      const isVideo = file.type.startsWith("video/");
      const isLt5G = file.size / 1024 / 1024 / 1024 < 5;

      console.log("Video file selected:", file);

      if (!isVideo) {
        message.error("Vui lòng chọn file video!");
        return false;
      }

      if (!isLt5G) {
        message.error("Video phải nhỏ hơn 5GB!");
        return false;
      }

      setVideoFileList([file]);
      if (previewVideo) {
        URL.revokeObjectURL(previewVideo);
      }
      setPreviewVideo(URL.createObjectURL(file));
      return false;
    },
    fileList: videoFileList,
    onRemove: () => {
      setVideoFileList([]);
      setPreviewVideo(null);
      setVideoProgress(0);
      reset();
    },
  };

  const thumbnailUploadProps = {
    beforeUpload: (file) => {
      const isImage =
        file.type && /image\/(png|jpeg|jpg|gif|bmp|webp)/i.test(file.type);
      const isLt10M = file.size / 1024 / 1024 < 10;

      console.log("Thumbnail file selected:", file);

      if (!isImage) {
        message.error(
          "Vui lòng chọn file ảnh (png, jpeg, jpg, gif, bmp, webp)!"
        );
        return false;
      }

      if (!isLt10M) {
        message.error("Ảnh thumbnail phải nhỏ hơn 10MB!");
        return false;
      }

      setThumbnailFileList([file]);
      if (previewThumbnail) {
        URL.revokeObjectURL(previewThumbnail);
      }
      setPreviewThumbnail(URL.createObjectURL(file));
      return false;
    },
    fileList: thumbnailFileList,
    onRemove: () => {
      setThumbnailFileList([]);
      setPreviewThumbnail(null);
      setThumbnailProgress(0);
    },
  };

  // CSS để đảm bảo tỉ lệ 16:9 và overflow hidden
  const mediaContainerStyle = {
    position: "relative",
    width: "100%",
    aspectRatio: "16 / 9",
    overflow: "hidden",
    borderRadius: "8px",
  };

  const mediaStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    top: 0,
    left: 0,
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="Tải video" />
        <Step title="Tải thumbnail" />
        <Step title="Xác nhận thông tin" />
      </Steps>

      {currentStep === 0 && (
        <div>
          <Upload {...videoUploadProps} accept="video/*">
            <Button icon={<UploadOutlined />}>Chọn video</Button>
          </Upload>
          {previewVideo && (
            <div style={{ marginTop: 16 }}>
              <h3>Xem trước video:</h3>
              <div style={mediaContainerStyle}>
                <video src={previewVideo} controls style={mediaStyle} />
              </div>
            </div>
          )}
          {isUploading && (
            <div style={{ marginTop: 16 }}>
              <Progress
                percent={videoProgress}
                status={
                  videoProgress === 100
                    ? "success"
                    : isUploading
                    ? "active"
                    : "exception"
                }
              />
            </div>
          )}
          <Button
            type="primary"
            onClick={handleUploadVideo}
            loading={isUploading}
            disabled={isUploading || videoFileList.length === 0}
            style={{ marginTop: 16 }}
            block
          >
            {isUploading ? "Đang tải lên..." : "Tải video lên"}
          </Button>
        </div>
      )}

      {currentStep === 1 && (
        <div>
          {videoUrl && (
            <div style={{ marginBottom: 16 }}>
              <h3>Xem trước video:</h3>
              <div style={mediaContainerStyle}>
                <video src={videoUrl} controls style={mediaStyle} />
              </div>
            </div>
          )}
          {thumbnail && !previewThumbnail && (
            <div style={{ marginBottom: 16 }}>
              <h3>Thumbnail mặc định:</h3>
              <div style={{ ...mediaContainerStyle, maxWidth: 200 }}>
                <img
                  src={thumbnail}
                  alt="Thumbnail mặc định"
                  style={mediaStyle}
                />
              </div>
            </div>
          )}
          {previewThumbnail && (
            <div style={{ marginBottom: 16 }}>
              <h3>Xem trước thumbnail:</h3>
              <div style={{ ...mediaContainerStyle, maxWidth: 200 }}>
                <img
                  src={previewThumbnail}
                  alt="Thumbnail tùy chỉnh"
                  style={mediaStyle}
                />
              </div>
            </div>
          )}
          <Upload {...thumbnailUploadProps} accept="image/*">
            <Button icon={<UploadOutlined />}>Chọn ảnh thumbnail khác</Button>
          </Upload>
          {isUploadingThumbnail && (
            <div style={{ marginTop: 16 }}>
              <Progress
                percent={thumbnailProgress}
                status={
                  thumbnailProgress === 100
                    ? "success"
                    : isUploadingThumbnail
                    ? "active"
                    : "exception"
                }
              />
            </div>
          )}
          <Space style={{ marginTop: 16, width: "100%" }}>
            <Button
              type="primary"
              onClick={handleUploadThumbnail}
              loading={isUploadingThumbnail}
              disabled={isUploadingThumbnail || thumbnailFileList.length === 0}
              style={{ flex: 1 }}
            >
              {isUploadingThumbnail ? "Đang tải lên..." : "Tải thumbnail lên"}
            </Button>
            <Button
              onClick={handleSkipThumbnail}
              disabled={isUploadingThumbnail}
              style={{ flex: 1 }}
            >
              Bỏ qua (dùng thumbnail mặc định)
            </Button>
          </Space>
          <Button
            type="default"
            onClick={handleSkipThumbnail}
            disabled={isUploadingThumbnail || !videoThumbnail}
            style={{ marginTop: 8 }}
            block
          >
            Sử dụng thumbnail từ video
          </Button>
          <Button
            style={{ marginTop: 8 }}
            onClick={() => {
              setCurrentStep(0);
              setVideoThumbnail(null);
              reset();
              setPreviewVideo(null);
              setPreviewThumbnail(null);
              setVideoProgress(0);
              setThumbnailProgress(0);
            }}
            disabled={isUploadingThumbnail}
            block
          >
            Quay lại
          </Button>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h3>Xem trước:</h3>
          <div style={{ marginBottom: 16 }}>
            <h4>Video:</h4>
            <div style={mediaContainerStyle}>
              <video
                src={videoUrl}
                poster={thumbnail}
                controls
                style={mediaStyle}
              />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <h4>Thumbnail:</h4>
            <div style={{ ...mediaContainerStyle, maxWidth: 200 }}>
              <img src={thumbnail} alt="Thumbnail" style={mediaStyle} />
            </div>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreate}
            style={{ marginTop: 16 }}
          >
            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
            >
              <Input placeholder="Nhập tiêu đề video" />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <Input.TextArea rows={4} placeholder="Nhập mô tả video" />
            </Form.Item>
            <Form.Item label="URL Video">
              <Input value={videoUrl} disabled />
            </Form.Item>
            <Form.Item label="URL Thumbnail">
              <Input value={thumbnail} disabled />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isCreating}
                disabled={isCreating}
              >
                {isCreating ? "Đang tạo..." : "Tạo video"}
              </Button>
              <Button
                style={{ marginTop: 8 }}
                onClick={() => {
                  setCurrentStep(1);
                }}
                disabled={isCreating}
                block
              >
                Quay lại
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};

export default VideoUploadForm;
