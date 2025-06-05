import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserPlaylists,
  createPlaylist,
  addVideoToPlaylist,
  getVideosInPlaylist,
  deletePlaylist,
  removeVideoFromPlaylist,
} from "../services/playListApi";
import { App } from "antd";

export const useUserPlaylists = (user_id) => {
  return useQuery({
    queryKey: ["playlists", user_id],
    queryFn: () => getUserPlaylists(user_id),
    enabled: !!user_id,
    select: (data) => {
      if (Array.isArray(data)) {
        return data;
      }
      return data?.playlists || [];
    },
  });
};

export const useCreatePlaylist = () => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPlaylist,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["playlists"]);
      message.success("Danh sách phát được tạo thành công");
      return data;
    },
    onError: (error) => {
      console.error("Lỗi tạo danh sách phát:", error);
      message.error("Không thể tạo danh sách phát");
    },
  });
};

export const useVideosInPlaylist = (playlistId) => {
  return useQuery({
    queryKey: ["playlistVideos", playlistId],
    queryFn: () => getVideosInPlaylist(playlistId),
    enabled: !!playlistId,
    select: (data) => {
      return Array.isArray(data) ? data : data?.videos || [];
    },
  });
};

export const useAddVideoToPlaylist = () => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addVideoToPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries(["playlists"]);
      message.success("Video được thêm vào danh sách phát");
    },
    onError: (error) => {
      console.error("Lỗi thêm video:", error);
      if (
        error.response?.status === 400 &&
        error.response?.message === "Video already exists in playlist"
      ) {
        message.warning("Video đã tồn tại trong danh sách phát");
      } else {
        message.error("Đã có lỗi xảy ra");
      }
    },
  });
};

export const useDeletePlaylist = () => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries(["playlists"]);
      message.success("Danh sách phát đã được xóa");
    },
    onError: (error) => {
      console.error("Lỗi xóa danh sách phát:", error);
      message.error("Không thể xóa danh sách phát");
    },
  });
};

export const useRemoveVideoFromPlaylist = () => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeVideoFromPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries(["playlistVideos"]);
      message.success("Video đã được xóa khỏi danh sách phát");
    },
    onError: (error) => {
      console.error("Lỗi xóa video:", error);
      message.error("Không thể xóa video khỏi danh sách phát");
    },
  });
};
