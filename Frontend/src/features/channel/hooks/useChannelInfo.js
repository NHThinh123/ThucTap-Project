import { useQuery } from "@tanstack/react-query";
import { getChannelInfoApi } from "../services/subscriptionApi";

const useChannelInfo = (channelId) => {
  return useQuery({
    queryKey: ["channelInfo", channelId],
    queryFn: () => {
      const response = getChannelInfoApi(channelId);
      return response;
    },
  });
};

export default useChannelInfo;
