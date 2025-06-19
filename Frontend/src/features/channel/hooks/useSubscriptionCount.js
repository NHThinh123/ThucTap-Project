import { useQuery } from "@tanstack/react-query";
import { getSubscriptionCountApi } from "../services/subscriptionApi";

const useSubscriptionCount = (userId) => {
  return useQuery({
    queryKey: ["subscriptionCount", userId],
    queryFn: () => {
      const response = getSubscriptionCountApi(userId);
      return response;
    },
    enabled: !!userId,
    staleTime: 30000, // Cache trong 30 giây
    refetchOnWindowFocus: false,
  });
};

export default useSubscriptionCount;
