import { useQuery } from "@tanstack/react-query";
import { getSubscribersApi } from "../services/subscriptionApi";

const useSubscribers = (userId) => {
  return useQuery({
    queryKey: ["subscribers", userId],
    queryFn: () => {
      const response = getSubscribersApi(userId);
      return response;
    },
    enabled: !!userId,
    staleTime: 30000, // Cache trong 30 giây
    refetchOnWindowFocus: false,
  });
};

export default useSubscribers;
