import { Form, Input, Checkbox, Button, Divider } from "antd";
import { useCreatePlaylist } from "../../hooks/usePlayList";
import { useModal } from "../../../../contexts/modal.context";
import { useContext } from "react";
import { AuthContext } from "../../../../contexts/auth.context";
import PlaylistModalContent from "../templates/PlaylistModalContent";

const PlaylistForm = ({ user_id, video_id }) => {
  const [form] = Form.useForm();
  const { mutate: createPlaylist, isPending } = useCreatePlaylist();
  const { closeModal, openModal } = useModal();
  const { auth } = useContext(AuthContext);

  const handleSubmit = (values) => {
    createPlaylist(
      {
        user_id: auth.user.id,
        title_playlist: values.title,
        description_playlist: values.description || "",
        isPublic: values.isPublic || true,
      },
      {
        onSuccess: () => {
          // Đóng modal sau khi tạo danh sách phát thành công
          closeModal();
          form.resetFields();
        },
        onError: (error) => {
          console.error("Lỗi tạo danh sách phát:", error);
        },
      }
    );
  };

  const handleCancel = () => {
    // Đóng modal hiện tại và mở lại modal PlaylistModalContent
    closeModal();
    openModal(<PlaylistModalContent video_id={video_id} user_id={user_id} />);
  };

  return (
    <>
      <Divider>Tạo danh sách phát</Divider>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="title"
          label="Tiêu đề danh sách phát"
          rules={[{ required: true, message: "Hãy nhập tiêu đề" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="isPublic" valuePropName="checked">
          <Checkbox>Công khai</Checkbox>
        </Form.Item>
        <Form.Item>
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 16 }}
          >
            <Button type="primary" htmlType="submit" loading={isPending}>
              Tạo
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
              Hủy
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default PlaylistForm;
