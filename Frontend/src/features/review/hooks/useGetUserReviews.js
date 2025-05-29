import { useQuery } from "@tanstack/react-query";
import { getUserReviewsApi } from "../services/reviewApi";

const useGetUserReviews = (userId, options = {}) => {
  return useQuery({
    queryKey: ["userReviews", userId],
    queryFn: () => getUserReviewsApi(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 phút
    ...options,
  });
};

export default useGetUserReviews;
