import { useMutation } from "@tanstack/react-query";
import {
  uploadVideoApi,
  createVideoApi,
  uploadThumbnailApi,
} from "../services/uploadVideoApi";
import { App } from "antd";

export const useVideoUpload = () => {
  const { message } = App.useApp();

  const uploadMutation = useMutation({
    mutationFn: ({ file, onProgress }) => uploadVideoApi(file, { onProgress }),
    onSuccess: (data, { onSuccess }) => {
      console.log("Video upload success:", data);
      message.success("Video đã tải lên thành công!");
      onSuccess?.(data);
    },
    onError: (error, { onError }) => {
      console.error("Video upload error:", error);
      message.error(error.message || "Lỗi khi tải video!");
      onError?.(error);
    },
  });

  const uploadThumbnailMutation = useMutation({
    mutationFn: ({ file, onProgress }) =>
      uploadThumbnailApi(file, { onProgress }),
    onSuccess: (data, { onSuccess }) => {
      console.log("Thumbnail upload success:", data);
      message.success("Thumbnail đã tải lên thành công!");
      onSuccess?.(data);
    },
    onError: (error, { onError }) => {
      console.error("Thumbnail upload error:", error);
      message.error("Lỗi khi tải thumbnail!");
      onError?.(error);
    },
  });

  const createMutation = useMutation({
    mutationFn: createVideoApi,
    onSuccess: (data) => {
      console.log("Create video success:", data);
      message.success("Video đã được tạo thành công!");
    },
    onError: (error) => {
      console.error("Create video error:", error);
      message.error("Lỗi khi tạo video!");
    },
  });

  const hookReturn = {
    uploadVideo: (file, callbacks = {}) => {
      uploadMutation.mutate({ file, ...callbacks });
    },
    isUploading: uploadMutation.isPending,
    videoUrl: uploadMutation.data?.videoUrl,
    thumbnail: uploadThumbnailMutation.data || uploadMutation.data?.thumbnail,
    isUploadingThumbnail: uploadThumbnailMutation.isPending,
    duration: uploadMutation.data?.duration,
    createVideo: createMutation.mutate,
    isCreating: createMutation.isPending,
    uploadThumbnail: (file, callbacks = {}) => {
      uploadThumbnailMutation.mutate({ file, ...callbacks });
    },
    reset: () => {
      uploadMutation.reset();
      uploadThumbnailMutation.reset();
      createMutation.reset();
    },
  };

  console.log("useVideoUpload hook return:", Object.keys(hookReturn));

  return hookReturn;
};
