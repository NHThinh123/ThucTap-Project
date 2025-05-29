import { useQuery } from "@tanstack/react-query";
import { getUserSubscriptionsApi } from "../services/subscriptionApi";

const useUserSubscriptions = (userId) => {
  return useQuery({
    queryKey: ["userSubscriptions", userId],
    queryFn: () => {
      const response = getUserSubscriptionsApi(userId);
      return response;
    },
    enabled: !!userId,
    staleTime: 30000, // Cache trong 30 giây
    refetchOnWindowFocus: false,
  });
};

export default useUserSubscriptions;
