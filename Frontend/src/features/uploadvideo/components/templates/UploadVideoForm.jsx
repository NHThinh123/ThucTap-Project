/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { Form, Input, Button, Upload, message, Steps, App } from "antd";
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
  } = useVideoUpload();
  const { openModal, closeModal } = useModal();
  const { auth } = useContext(AuthContext);

  const handleUploadVideo = async () => {
    if (videoFileList.length === 0) {
      message.error("Vui lòng chọn video!");
      return;
    }

    try {
      await uploadVideo(videoFileList[0], {
        onSuccess: () => {
          setCurrentStep(1);
          message.success("Tải video thành công!");
        },
        onError: (error) => {
          message.error("Tải video thất bại!");
        },
      });
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tải video!");
    }
  };

  const handleUploadThumbnail = async () => {
    if (thumbnailFileList.length === 0) {
      message.error("Vui lòng chọn ảnh thumbnail!");
      return;
    }

    try {
      await uploadThumbnail(thumbnailFileList[0], {
        onSuccess: () => {
          setCurrentStep(2);
          message.success("Tải ảnh thumbnail thành công!");
        },
        onError: (error) => {
          message.error("Tải ảnh thumbnail thất bại!");
        },
      });
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tải ảnh thumbnail!");
    }
  };

  const handleCreate = async (values) => {
    console.log("Trạng thái auth:", auth);
    console.log("ID người dùng:", auth.user?.id);
    console.log("Video URL:", videoUrl);
    console.log("Thumbnail URL:", thumbnail);
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
    if (!thumbnail) {
      message.error("Vui lòng tải ảnh thumbnail lên trước!");
      return;
    }

    try {
      await createVideo(
        {
          user_id: auth.user.id,
          title: values.title,
          description: values.description,
          video_url: videoUrl,
          thumbnail: thumbnail,
          duration: values.duration || 0,
        },
        {
          onSuccess: (data) => {
            console.log("Tạo video thành công:", data);
            form.resetFields();
            setVideoFileList([]);
            setThumbnailFileList([]);
            reset();
            setCurrentStep(0);
            closeModal();
            onSuccess();
            message.success("Tạo video thành công!");
          },
          onError: (error) => {
            console.error("Lỗi từ createVideo:", error.message);
            message.error("Tạo video thất bại! Bạn có thể thử lại.");
          },
        }
      );
    } catch (error) {
      console.error("Lỗi không xác định:", error.message);
      message.error("Đã xảy ra lỗi khi tạo video!");
    }
  };

  const videoUploadProps = {
    beforeUpload: (file) => {
      const isVideo = file.type.startsWith("video/");
      const isLt100M = file.size / 1024 / 1024 < 100;

      if (!isVideo) {
        message.error("Vui lòng chọn file video!");
        return false;
      }

      if (!isLt100M) {
        message.error("Video phải nhỏ hơn 100MB!");
        return false;
      }

      setVideoFileList([file]);
      return false;
    },
    fileList: videoFileList,
    onRemove: () => {
      setVideoFileList([]);
      reset();
    },
  };

  const thumbnailUploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isImage) {
        message.error("Vui lòng chọn file ảnh!");
        return false;
      }

      if (!isLt10M) {
        message.error("Ảnh thumbnail phải nhỏ hơn 10MB!");
        return false;
      }

      setThumbnailFileList([file]);
      return false;
    },
    fileList: thumbnailFileList,
    onRemove: () => {
      setThumbnailFileList([]);
      reset();
    },
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 24 }}>
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="Tải video" />
        <Step title="Tải thumbnail" />
        <Step title="Nhập thông tin" />
      </Steps>

      {currentStep === 0 && (
        <div>
          <Upload {...videoUploadProps} accept="video/*">
            <Button icon={<UploadOutlined />}>Chọn video</Button>
          </Upload>
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
          <Upload {...thumbnailUploadProps} accept="image/*">
            <Button icon={<UploadOutlined />}>Chọn ảnh thumbnail</Button>
          </Upload>
          <Button
            type="primary"
            onClick={handleUploadThumbnail}
            loading={isUploadingThumbnail}
            disabled={isUploadingThumbnail || thumbnailFileList.length === 0}
            style={{ marginTop: 16 }}
            block
          >
            {isUploadingThumbnail ? "Đang tải lên..." : "Tải ảnh thumbnail lên"}
          </Button>
          <Button
            style={{ marginTop: 8 }}
            onClick={() => {
              setCurrentStep(0);
              reset();
            }}
            disabled={isUploadingThumbnail}
            block
          >
            Quay lại
          </Button>
        </div>
      )}

      {currentStep === 2 && (
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
          <Form.Item
            label="Thời lượng (giây)"
            name="duration"
            rules={[{ required: true, message: "Vui lòng nhập thời lượng!" }]}
          >
            <Input type="number" placeholder="Nhập thời lượng video (giây)" />
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
                reset();
              }}
              disabled={isCreating}
              block
            >
              Quay lại
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default VideoUploadForm;
