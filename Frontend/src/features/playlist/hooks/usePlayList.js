import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserPlaylists,
  createPlaylist,
  addVideoToPlaylist,
} from "../services/playListApi";
import { App } from "antd";

export const useUserPlaylists = (user_id) => {
  return useQuery({
    queryKey: ["playlists", user_id],
    queryFn: () => getUserPlaylists(user_id),
    enabled: !!user_id,
    select: (data) => {
      // Handle cả trường hợp data là array hoặc object với structure mới
      if (Array.isArray(data)) {
        return data;
      }
      // Nếu data có structure từ API response
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
      // Return the created playlist data
      return data;
    },
    onError: (error) => {
      console.error("Create playlist error:", error);
      message.error("Failed to create playlist");
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
      message.success("Video added to playlist");
    },
    onError: (error) => {
      console.error("Add video error:", error);
      message.error("Failed to add video to playlist");
    },
  });
};
