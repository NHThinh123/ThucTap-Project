/* eslint-disable no-unused-vars */
import { Form, Input, Checkbox, Button, Divider } from "antd";

import {
  useAddVideoToPlaylist,
  useCreatePlaylist,
} from "../../hooks/usePlayList";
import { useModal } from "../../../../contexts/modal.context";
import { useContext } from "react";
import { AuthContext } from "../../../../contexts/auth.context";

const PlaylistForm = ({ user_id, video_id }) => {
  const [form] = Form.useForm();
  const { mutate: createPlaylist, isPending } = useCreatePlaylist();
  const { mutate: addVideo } = useAddVideoToPlaylist();
  const { closeModal } = useModal();
  const { auth } = useContext(AuthContext);

  if (!video_id) {
    console.error(
      "PlaylistForm: videoId is undefined. Please provide a valid videoId."
    );
  }

  const handleSubmit = (values) => {
    createPlaylist(
      {
        user_id: auth.user.id,
        title_playlist: values.title,
        description_playlist: values.description || "",
        isPublic: values.isPublic || true,
      },
      {
        onSuccess: (newPlaylist) => {
          if (!newPlaylist?._id || !video_id) {
            return;
          }

          const validPlaylistId = String(newPlaylist._id).trim();
          const validVideoId = String(video_id).trim();

          addVideo(
            {
              playlistId: validPlaylistId,
              video_id: validVideoId,
            },
            {
              onSuccess: closeModal,
              onError: (error) => {
                console.error("Add video to new playlist error:", error);
              },
            }
          );
          form.resetFields();
        },
      }
    );
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
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export default PlaylistForm;
