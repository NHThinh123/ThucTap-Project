import { useQuery } from "@tanstack/react-query";
import { getVideoAverageRatingApi } from "../services/reviewApi";

const useGetVideoAverageRating = (videoId, options = {}) => {
  return useQuery({
    queryKey: ["videoAverageRating", videoId],
    queryFn: () => getVideoAverageRatingApi(videoId),
    enabled: !!videoId,
    staleTime: 5 * 60 * 1000, // 5 phút
    ...options,
  });
};

export default useGetVideoAverageRating;
