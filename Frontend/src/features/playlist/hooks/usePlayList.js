import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserPlaylists,
  createPlaylist,
  addVideoToPlaylist,
  getVideosInPlaylist,
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
      message.success("Playlist created successfully");
      return data;
    },
    onError: (error) => {
      console.error("Create playlist error:", error);
      message.error("Failed to create playlist");
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
      console.error("Add video error:", error);
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
