// src/pages/UploadPage.jsx
import React, { useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useModal } from "../context/ModalContext";

const UploadVideoForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const { closeModal } = useModal();

  const handleUpload = async (values) => {
    // Giả lập gửi dữ liệu lên server
    try {
      console.log("Dữ liệu gửi đi:", { ...values, file: fileList[0] });
      message.success("Video đang được tải lên!");
      form.resetFields();
      setFileList([]);
      closeModal();
    } catch {
      message.error("Lỗi khi tải lên video!");
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      // Kiểm tra định dạng và kích thước file
      const isVideo = file.type.startsWith("video/");
      const isLt100M = file.size / 1024 / 1024 < 100; // Giới hạn 100MB
      if (!isVideo) {
        message.error("Vui lòng chọn file video!");
        return false;
      }
      if (!isLt100M) {
        message.error("Video phải nhỏ hơn 100MB!");
        return false;
      }
      setFileList([file]);
      return false; // Ngăn upload tự động
    },
    fileList,
    onRemove: () => setFileList([]),
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleUpload}
      style={{ maxWidth: 500, margin: "0 auto" }}
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
        label="Video"
        name="video"
        rules={[{ required: true, message: "Vui lòng chọn video!" }]}
      >
        <Upload {...uploadProps} accept="video/*">
          <Button icon={<UploadOutlined />}>Chọn video</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Đăng video
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UploadVideoForm;
