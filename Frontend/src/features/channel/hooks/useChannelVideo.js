// hooks/useVideos.js
import { useQuery } from "@tanstack/react-query";
import { getVideoChannel } from "../services/channelApi";

export const useChannelVideo = (params) => {
  return useQuery({
    queryKey: ["videos", params],
    queryFn: () => getVideoChannel(params),
    staleTime: 1000 * 60, // cache 1 phút
  });
};
