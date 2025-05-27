import { useQuery } from "@tanstack/react-query";
import { getVideoCommentsApi } from "../services/commentApi";

const useVideoComments = (videoId) => {
  return useQuery({
    queryKey: ["videoComments", videoId],
    queryFn: () => getVideoCommentsApi(videoId).then((response) => response),
    enabled: !!videoId, // Only run query if videoId is truthy
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes
    retry: 1, // Retry failed requests once
  });
};

export default useVideoComments;
