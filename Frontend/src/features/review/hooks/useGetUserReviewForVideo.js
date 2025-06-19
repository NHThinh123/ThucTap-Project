import { useQuery } from "@tanstack/react-query";
import { getUserReviewForVideoApi } from "../services/reviewApi";

const useGetUserReviewForVideo = (userId, videoId, options = {}) => {
  return useQuery({
    queryKey: ["userReviewForVideo", userId, videoId],
    queryFn: () => getUserReviewForVideoApi(userId, videoId),
    enabled: !!userId && !!videoId,
    staleTime: 5 * 60 * 1000, // 5 phút
    ...options,
  });
};

export default useGetUserReviewForVideo;
