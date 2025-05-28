/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect, useRef } from "react";
import { Form, Input, Button, Upload, Steps, App } from "antd";
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
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const videoRef = useRef(null);
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
    if (duration && currentStep === 2) {
      form.setFieldsValue({ duration });
    }
  }, [duration, currentStep, form]);

  // Tạo thumbnail từ video
  const generateThumbnail = (videoElement) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Di chuyển đến giây thứ 1 hoặc khung hình đầu tiên
      videoElement.currentTime = Math.min(1, videoElement.duration || 1);

      videoElement.onseeked = () => {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.8); // JPEG với chất lượng 80%
        resolve(thumbnailDataUrl);
      };

      videoElement.onerror = () => {
        reject(new Error("Không thể tạo thumbnail từ video"));
      };
    });
  };

  // Xử lý tải video và tạo thumbnail
  const handleUploadVideo = async () => {
    if (videoFileList.length === 0) {
      message.error("Vui lòng chọn video!");
      return;
    }

    try {
      await uploadVideo(videoFileList[0], {
        onSuccess: async ({ videoUrl }) => {
          // Tạo thumbnail sau khi tải video
          if (videoUrl && videoRef.current) {
            videoRef.current.src = videoUrl;
            try {
              const thumbnailDataUrl = await generateThumbnail(
                videoRef.current
              );
              setVideoThumbnail(thumbnailDataUrl);
            } catch (error) {
              console.error("Lỗi tạo thumbnail:", error);
              message.warning("Không thể tạo thumbnail tự động từ video");
            }
          }
          setCurrentStep(1);
        },
        onError: (error) => {
          message.error("Tải video thất bại!");
        },
      });
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tải video!");
    }
  };

  // Chuyển base64 thành File để tải lên
  const base64ToFile = (base64, filename) => {
    const [header, data] = base64.split(",");
    const mime = header.match(/:(.*?);/)?.[1];
    const binary = atob(data);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new File([array], filename, { type: mime });
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
        },
        onError: (error) => {
          message.error("Tải ảnh thumbnail thất bại!");
        },
      });
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tải ảnh thumbnail!");
    }
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
    if (!thumbnail && !videoThumbnail) {
      message.error(
        "Vui lòng tải ảnh thumbnail hoặc sử dụng thumbnail từ video!"
      );
      return;
    }

    try {
      let finalThumbnail = thumbnail;
      // Nếu không có thumbnail tùy chỉnh, tải thumbnail tự động lên
      if (!thumbnail && videoThumbnail) {
        const thumbnailFile = base64ToFile(
          videoThumbnail,
          "video_thumbnail.jpg"
        );
        await uploadThumbnail(thumbnailFile, {
          onSuccess: (uploadedThumbnail) => {
            finalThumbnail = uploadedThumbnail;
          },
          onError: (error) => {
            throw new Error("Không thể tải thumbnail tự động lên!");
          },
        });
      }

      const videoDuration =
        values.duration !== undefined
          ? parseInt(values.duration)
          : duration || 0;

      await createVideo(
        {
          user_id: auth.user.id,
          title: values.title,
          description: values.description,
          video_url: videoUrl,
          thumbnail: finalThumbnail || videoThumbnail, // Sử dụng thumbnail đã tải hoặc base64
          duration: videoDuration,
        },
        {
          onSuccess: (data) => {
            form.resetFields();
            setVideoFileList([]);
            setThumbnailFileList([]);
            setVideoThumbnail(null);
            reset();
            setCurrentStep(0);
            closeModal();
            onSuccess && onSuccess(data);
          },
          onError: (error) => {
            console.error("Lỗi từ createVideo:", error);
            message.error(
              "Tạo video thất bại! " + (error.message || "Bạn có thể thử lại.")
            );
          },
        }
      );
    } catch (error) {
      console.error("Lỗi không xác định:", error);
      message.error("Đã xảy ra lỗi khi tạo video: " + (error.message || ""));
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
      setVideoThumbnail(null);
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
      {/* Video ẩn để tạo thumbnail */}
      <video ref={videoRef} style={{ display: "none" }} />

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
          {videoUrl && (
            <div style={{ marginBottom: 16 }}>
              <video
                src={videoUrl}
                controls
                style={{ width: "100%", maxHeight: 200 }}
              />
              {videoThumbnail && (
                <div style={{ marginTop: 8 }}>
                  <p>Thumbnail từ video:</p>
                  <img
                    src={videoThumbnail}
                    alt="Video thumbnail"
                    style={{ maxWidth: "100%", maxHeight: 100 }}
                  />
                </div>
              )}
            </div>
          )}
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
          initialValues={{ duration: duration || 0 }}
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

          <Form.Item label="Video">
            <video
              src={videoUrl}
              controls
              style={{ width: "100%", maxHeight: 200 }}
            />
          </Form.Item>
          <Form.Item label="Thumbnail">
            <img
              src={thumbnail || videoThumbnail}
              alt="Thumbnail"
              style={{ maxWidth: "100%", maxHeight: 100 }}
            />
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
      )}
    </div>
  );
};

export default VideoUploadForm;
