import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAllVideoReviewsApi } from "../services/reviewApi";

const useDeleteAllVideoReviews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAllVideoReviewsApi,
    onSuccess: (data, variables) => {
      // variables chứa video_id
      queryClient.invalidateQueries(["videoReviews", variables]);
      queryClient.invalidateQueries(["videoReviewsCount", variables]);
      queryClient.invalidateQueries(["videoAverageRating", variables]);
      // Invalidate tất cả user reviews vì có thể có nhiều user đã review video này
      queryClient.invalidateQueries(["userReviews"]);
      queryClient.invalidateQueries(["userReviewForVideo"]);
    },
  });
};

export default useDeleteAllVideoReviews;
