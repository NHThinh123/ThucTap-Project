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
  });
};

export const useCreatePlaylist = () => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries(["playlists"]);
      message.success("Playlist created successfully");
    },
    onError: () => {
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
    onError: () => {
      message.error("Failed to add video to playlist");
    },
  });
};
