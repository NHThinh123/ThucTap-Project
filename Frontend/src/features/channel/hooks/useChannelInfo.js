import { useQuery } from "@tanstack/react-query";
import { getChannelInfoApi } from "../services/subscriptionApi";

const useChannelInfo = (channelId) => {
  return useQuery({
    queryKey: ["channelInfo", channelId],
    queryFn: () => {
      const response = getChannelInfoApi(channelId);
      return response;
    },
    enabled: !!channelId,
    staleTime: 30000, // Cache trong 30 giây
    refetchOnWindowFocus: false,
  });
};

export default useChannelInfo;
