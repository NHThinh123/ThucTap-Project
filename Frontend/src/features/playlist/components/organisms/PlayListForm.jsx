/* eslint-disable no-unused-vars */
import { Form, Input, Checkbox, Button, Divider } from "antd";

import {
  useAddVideoToPlaylist,
  useCreatePlaylist,
} from "../../hooks/usePlayList";
import { useModal } from "../../../../contexts/modal.context";
import { useContext } from "react";
import { AuthContext } from "../../../../contexts/auth.context";

const PlaylistForm = ({ user_id, videoId }) => {
  const [form] = Form.useForm();
  const { mutate: createPlaylist, isPending } = useCreatePlaylist();
  const { mutate: addVideo } = useAddVideoToPlaylist();
  const { closeModal } = useModal();
  const { auth } = useContext(AuthContext);
  if (!videoId) {
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
          if (!newPlaylist?._id || !videoId) {
            console.error("Missing playlistId or videoId", {
              newPlaylist,
              videoId,
            });
            return;
          }
          addVideo(
            { playlistId: newPlaylist._id, videoId },
            { onSuccess: closeModal }
          );
          form.resetFields();
        },
      }
    );
  };

  return (
    <>
      <Divider>Create New Playlist</Divider>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="title"
          label="Playlist Title"
          rules={[{ required: true, message: "Please enter a playlist title" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="isPublic" valuePropName="checked">
          <Checkbox>Public Playlist</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Create and Add Video
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default PlaylistForm;
