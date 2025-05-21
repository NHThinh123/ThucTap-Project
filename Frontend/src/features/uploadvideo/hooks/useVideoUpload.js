/* eslint-disable no-unused-vars */
import { useMutation } from "@tanstack/react-query";
import {
  uploadVideoApi,
  createVideoApi,
  uploadThumbnailApi,
} from "../services/uploadVideoApi";
import { App } from "antd";

export const useVideoUpload = () => {
  // Upload video
  const { message } = App.useApp();
  const uploadMutation = useMutation({
    mutationFn: uploadVideoApi,
    onSuccess: ({ videoUrl, duration }) => {
      message.success("Video đã tải lên thành công!");
    },
    onError: (error) => {
      message.error(error.message || "Lỗi khi tải video!");
    },
  });
  //upload image
  const uploadThumbnailMutation = useMutation({
    mutationFn: uploadThumbnailApi,
    onSuccess: (thumbnail) => {
      message.success("Thumbnail đã tải lên thành công!");
    },
    onError: (error) => {
      message.error(error.message || "Lỗi khi tải thumbnail!");
    },
  });

  //create video
  const createMutation = useMutation({
    mutationFn: createVideoApi,
    onSuccess: (data) => {
      message.success(data.message || "Video đã được tạo thành công!");
    },
    onError: (error) => {
      message.error(error.message || "Lỗi khi tạo video!");
    },
  });

  return {
    uploadVideo: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    videoUrl: uploadMutation.data?.videoUrl,
    duration: uploadMutation.data?.duration,
    uploadThumbnail: uploadThumbnailMutation.mutate,
    thumbnail: uploadThumbnailMutation.data,
    isUploadingThumbnail: uploadThumbnailMutation.isPending,
    createVideo: createMutation.mutate,
    isCreating: createMutation.isPending,
    reset: () => {
      uploadMutation.reset();
      createMutation.reset();
      uploadThumbnailMutation.reset();
    },
  };
};
