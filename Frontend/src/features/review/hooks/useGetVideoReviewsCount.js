import { useQuery } from "@tanstack/react-query";
import { getVideoReviewsCountApi } from "../services/reviewApi";

const useGetVideoReviewsCount = (videoId, options = {}) => {
  return useQuery({
    queryKey: ["videoReviewsCount", videoId],
    queryFn: () => getVideoReviewsCountApi(videoId),
    enabled: !!videoId,
    staleTime: 5 * 60 * 1000, // 5 phút
    ...options,
  });
};

export default useGetVideoReviewsCount;
