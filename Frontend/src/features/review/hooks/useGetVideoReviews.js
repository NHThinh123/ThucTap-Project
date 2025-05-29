import { useQuery } from "@tanstack/react-query";
import { getVideoReviewsApi } from "../services/reviewApi";

const useGetVideoReviews = (videoId, options = {}) => {
  return useQuery({
    queryKey: ["videoReviews", videoId],
    queryFn: () => getVideoReviewsApi(videoId),
    enabled: !!videoId,
    staleTime: 5 * 60 * 1000, // 5 phút
    ...options,
  });
};

export default useGetVideoReviews;
