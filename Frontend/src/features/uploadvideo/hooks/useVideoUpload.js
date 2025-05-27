/* eslint-disable no-unused-vars */
import { useMutation } from "@tanstack/react-query";
import {
  uploadVideoApi,
  createVideoApi,
  uploadThumbnailApi,
} from "../services/uploadVideoApi";
import { App } from "antd";

export const useVideoUpload = () => {
  const { message } = App.useApp();

  // Upload video
  const uploadMutation = useMutation({
    mutationFn: uploadVideoApi,
    onSuccess: ({ videoUrl, thumbnail, duration }) => {
      console.log("Video upload success:", { videoUrl, thumbnail, duration });
      message.success("Video đã tải lên thành công!");
    },
    onError: (error) => {
      console.error("Video upload error:", error);
      message.error(error.message || "Lỗi khi tải video!");
    },
  });

  // Upload thumbnail
  const uploadThumbnailMutation = useMutation({
    mutationFn: uploadThumbnailApi,
    onSuccess: (thumbnail) => {
      console.log("Thumbnail upload success:", thumbnail);
      message.success("Thumbnail đã tải lên thành công!");
    },
    onError: (error) => {
      console.error("Thumbnail upload error:", error);
      message.error(error.message || "Lỗi khi tải thumbnail!");
    },
  });

  // Create video
  const createMutation = useMutation({
    mutationFn: createVideoApi,
    onSuccess: (data) => {
      console.log("Create video success:", data);
      message.success(data.message || "Video đã được tạo thành công!");
    },
    onError: (error) => {
      console.error("Create video error:", error);
      message.error(error.message || "Lỗi khi tạo video!");
    },
  });

  // Debug: Log để kiểm tra object trả về
  const hookReturn = {
    uploadVideo: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    videoUrl: uploadMutation.data?.videoUrl,
    thumbnail: uploadThumbnailMutation.data || uploadMutation.data?.thumbnail,
    isUploadingThumbnail: uploadThumbnailMutation.isPending,
    duration: uploadMutation.data?.duration,
    createVideo: createMutation.mutate,
    isCreating: createMutation.isPending,
    uploadThumbnail: uploadThumbnailMutation.mutate, // Đảm bảo uploadThumbnail được trả về
    reset: () => {
      uploadMutation.reset();
      uploadThumbnailMutation.reset();
      createMutation.reset();
    },
  };

  console.log("useVideoUpload hook return:", Object.keys(hookReturn));

  return hookReturn;
};
