import { useQuery } from "@tanstack/react-query";
import { getVideoChannel } from "../services/channelApi";

export const useChannelVideo = (userId) => {
  return useQuery({
    queryKey: ["videos", userId || "popular"],
    queryFn: () => getVideoChannel(userId),
    staleTime: 1000 * 60,
    enabled: true,
  });
};
