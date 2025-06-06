import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editVideoApi, deleteVideoApi } from "../services/videoManagementApi";
import { message } from "antd";

export const useVideoManagement = (userId) => {
  const queryClient = useQueryClient();

  const editVideoMutation = useMutation({
    mutationFn: ({ videoId, data }) =>
      editVideoApi(videoId, { ...data, user_id: userId }),
    onSuccess: (data) => {
      message.open({
        type: "success",
        content: data.message || "Cập nhật video thành công!",
      });
      queryClient.invalidateQueries(["userVideos", userId]);
    },
    onError: (error) => {
      message.open({
        type: "error",
        content: error.message || "Cập nhật video thất bại!",
      });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: (videoId) => deleteVideoApi(videoId, userId),
    onSuccess: (data) => {
      message.open({
        type: "success",
        content: data.message || "Xóa video thành công!",
      });
      queryClient.invalidateQueries(["userVideos", userId]);
    },
    onError: (error) => {
      message.open({
        type: "error",
        content: error.message || "Xóa video thất bại!",
      });
    },
  });

  return {
    editVideo: (videoId, data) => editVideoMutation.mutate({ videoId, data }),
    isEditing: editVideoMutation.isPending,
    deleteVideo: (videoId) => deleteVideoMutation.mutate(videoId),
    isDeleting: deleteVideoMutation.isPending,
  };
};
