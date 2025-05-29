import { useQuery } from "@tanstack/react-query";
import { checkSubscriptionApi } from "../services/subscriptionApi";

const useCheckSubscription = (userId, channelId) => {
  return useQuery({
    queryKey: ["checkSubscription", userId, channelId],
    queryFn: () => {
      const response = checkSubscriptionApi(userId, channelId);
      return response;
    },
    enabled: !!userId && !!channelId,
    staleTime: 30000, // Cache trong 30 giây
    refetchOnWindowFocus: false,
  });
};

export default useCheckSubscription;
