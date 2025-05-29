import { useQuery } from "@tanstack/react-query";
import { getReviewApi } from "../services/reviewApi";

const useGetReview = (reviewId, options = {}) => {
  return useQuery({
    queryKey: ["review", reviewId],
    queryFn: () => getReviewApi(reviewId),
    enabled: !!reviewId,
    staleTime: 5 * 60 * 1000, // 5 phút
    ...options,
  });
};

export default useGetReview;
