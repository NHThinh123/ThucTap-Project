import { useQuery } from "@tanstack/react-query";
import { getReplyCommentsApi } from "../services/commentApi";

const useVideoReplyComments = (commentId) => {
  return useQuery({
    queryKey: ["videoReplyComments", commentId],
    queryFn: () => getReplyCommentsApi(commentId).then((response) => response),
    enabled: !!commentId, // Only run query if videoId is truthy
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep data in cache for 10 minutes
    retry: 1, // Retry failed requests once
  });
};

export default useVideoReplyComments;
