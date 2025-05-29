import { useQuery } from "@tanstack/react-query";
import { getVideoCommentsCountApi } from "../services/commentApi";

const useVideoCommentsCount = (videoId) => {
  return useQuery({
    queryKey: ["videoCommentsCount", videoId],
    queryFn: () => {
      const response = getVideoCommentsCountApi(videoId);
      return response;
    },
    enabled: !!videoId,
    staleTime: 30000, // Cache trong 30 giây
    refetchOnWindowFocus: false,
  });
};

export default useVideoCommentsCount;
