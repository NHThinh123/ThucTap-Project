import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editVideoApi, deleteVideoApi } from "../services/videoManagementApi";
import { message } from "antd";

export const useVideoManagement = () => {
  const queryClient = useQueryClient();

  const editVideoMutation = useMutation({
    mutationFn: ({ videoId, data }) => {
      if (!videoId || !data) {
        throw new Error("Video ID hoặc dữ liệu không hợp lệ");
      }
      return editVideoApi(videoId, data);
    },
    onSuccess: (data) => {
      message.open({
        type: "success",
        content: data.message || "Cập nhật video thành công!",
      });
      queryClient.invalidateQueries(["allVideos"]);
    },
    onError: (error) => {
      message.open({
        type: "error",
        content:
          error.response?.data?.message ||
          error.message ||
          "Cập nhật video thất bại!",
      });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: (videoId) => {
      if (!videoId) {
        throw new Error("Video ID không hợp lệ");
      }
      return deleteVideoApi(videoId);
    },
    onSuccess: (data) => {
      message.open({
        type: "success",
        content: data.message || "Xóa video thành công!",
      });
      queryClient.invalidateQueries(["allVideos"]);
    },
    onError: (error) => {
      message.open({
        type: "error",
        content:
          error.response?.data?.message ||
          error.message ||
          "Xóa video thất bại!",
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
